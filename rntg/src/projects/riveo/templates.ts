import { Skia } from '@shopify/react-native-skia'

export function glsl(
  source: TemplateStringsArray,
  ...values: Array<string | number>
) {
  let processed = source.flatMap((s, i) => [s, values[i]].filter(Boolean))
  return processed.join('')
}

export function frag(
  source: TemplateStringsArray,
  ...values: Array<string | number>
) {
  let code = glsl(source, ...values)
  let rt = Skia.RuntimeEffect.Make(code)
  if (rt === null) {
    throw new Error('Could not compile the shader')
  }
  return rt
}

export let Core = glsl`
const float PI = ${Math.PI};
const vec4 TRANSPARENT = vec4(0., 0., 0., 0.);


mat3 translate(vec2 p) {
  return mat3(1.0,0.0,0.0,0.0,1.0,0.0,p.x,p.y,1.0);
}

mat3 scale(vec2 s, vec2 p) {
  return translate(p) * mat3(s.x,0.0,0.0,0.0,s.y,0.0,0.0,0.0,1.0) * translate(-p);
}

vec2 project(vec2 p, mat3 m) {
  return (inverse(m) * vec3(p, 1.)).xy;
}

struct Paint {
  half4 color;
  bool stroke;
  float strokeWidth;
  int blendMode;
};

struct Context  {
  half4 color;
  float2 p;
  float2 resolution;
};

Paint createStroke(half4 color, float strokeWidth) {
  return Paint(color, true, strokeWidth, 0);
}

Paint createFill(half4 color) {
  return Paint(color, false, 0, 0);
}

// https://github.com/google/skia/blob/1f193df9b393d50da39570dab77a0bb5d28ec8ef/src/sksl/sksl_gpu.sksl
half4 blendSrcOver(half4 src, half4 dst) { return src + (1 - src.a)*dst; }
half4 blendDarken(half4 src, half4 dst) {
  half4 result = blendSrcOver(src, dst);
  result.rgb = min(result.rgb, (1 - dst.a)*src.rgb + dst.rgb);
  return result;
}

half4 blend(Context ctx, Paint paint) {
  return blendDarken(ctx.color, paint.color);
}

float sdLine(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = saturate(dot(pa, ba) / dot(ba, ba));
  return length(pa - ba * h);
}

float sdRRect(in vec2 p, in vec2 b, in vec4 r) {
  r.xy = (p.x>0.0)?r.xy : r.zw;
  r.x  = (p.y>0.0)?r.x  : r.y;
  vec2 q = abs(p)-b+r.x;
  return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x;
}

float sdRect(vec2 p, vec2 b) {
  vec2 d = abs(p)-b;
  return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float4 draw(inout Context ctx, float d, Paint paint) {
  bool isFill = !paint.stroke && d < 0;
  bool isStroke = paint.stroke && abs(d) < paint.strokeWidth/2;
  if (isFill || isStroke) {
    ctx.color = blend(ctx, paint);
  }
  return TRANSPARENT;
}

void drawLine(inout Context ctx, float2 a, float2 b, Paint paint) {
  float d = sdLine(ctx.p, a, b);
  draw(ctx, d, paint); 
}

void drawRect(inout Context ctx, float4 rect, Paint paint) {
  vec2 p = (2.0*ctx.p-ctx.resolution)/ctx.resolution;
  float2 wh = rect.zw - rect.xy;
  float d = sdRect(p, wh/ctx.resolution.xy);
  draw(ctx, d, paint); 
}

void drawRRect(inout Context ctx, float4 rect, float4 r, Paint paint) {
  vec2 p = (2.0*ctx.p-ctx.resolution)/ctx.resolution;
  float2 wh = rect.zw - rect.xy;
  float d = sdRRect(p, wh/ctx.resolution.xy,vec4(3)/r);
  draw(ctx, d, paint); 
}
`

export let PageCurl = frag`
uniform shader image;
uniform float pointer;
uniform float origin;
uniform vec4 container;
uniform float cornerRadius;
uniform vec2 resolution;

const float r = 150.0;
const float scaleFactor = 0.2;

${Core}

bool inRect(float2 p, float4 rct) {
  bool inRct = p.x > rct.x && p.x < rct.z && p.y > rct.y && p.y < rct.w;
  if (!inRct) {
    return false;
  }
  // Top left corner
  if (p.x < rct.x + cornerRadius && p.y < rct.y + cornerRadius) {
    return length(p - float2(rct.x + cornerRadius, rct.y + cornerRadius)) < cornerRadius;
  }
  // Top right corner
  if (p.x > rct.z - cornerRadius && p.y < rct.y + cornerRadius) {
    return length(p - float2(rct.z - cornerRadius, rct.y + cornerRadius)) < cornerRadius;
  }
  // Bottom left corner
  if (p.x < rct.x + cornerRadius && p.y > rct.w - cornerRadius) {
    return length(p - float2(rct.x + cornerRadius, rct.w - cornerRadius)) < cornerRadius;
  }
  // Bottom right corner
  if (p.x > rct.z - cornerRadius && p.y > rct.w - cornerRadius) {
    return length(p - float2(rct.z - cornerRadius, rct.w - cornerRadius)) < cornerRadius;
  }
  return true;
}

vec4 main(float2 xy) {
  Context ctx = Context(image.eval(xy), xy, resolution);
  float2 center = resolution * 0.5;
  float dx = origin - pointer; 
  float x = container.z - dx;
  float d = xy.x - x;

  if (d > r) {
    ctx.color = TRANSPARENT;
    if (inRect(xy, container)) {
      ctx.color.a = mix(0.5, 0, (d-r)/r);
    }
  } else if (d > 0) {
    float theta = asin(d / r);
    float d1 = theta * r;
    float d2 = (PI - theta) * r;

    vec2 s = vec2((1. + (1 - sin(PI/2 + theta)) * 0.1));
    mat3 transform = scale(s, center);
    vec2 uv = project(xy, transform);
    vec2 p1 = vec2(x + d1, uv.y);

    s = vec2((1.1 + sin(PI/2 + theta) * 0.1));
    transform = scale(s, center);
    uv = project(xy, transform);
    vec2 p2 = vec2(x + d2, uv.y);

    if (inRect(p2, container)) {
      ctx.color = image.eval(p2);
    } else if (inRect(p1, container)) {
      ctx.color = image.eval(p1);
      ctx.color.rgb *= pow(clamp((r - d) / r, 0., 1.), .2);
    } else if (inRect(xy, container)) {
      ctx.color = TRANSPARENT;
      ctx.color.a = 0.5;
    }
  } else {
    vec2 s = vec2(1.2);
    mat3 transform = scale(s, center);
    vec2 uv = project(xy, transform);
    vec2 p = vec2(x + abs(d) + PI * r, uv.y);
    if (inRect(p, container)) {
      ctx.color = image.eval(p);
    } else {
      ctx.color = image.eval(xy);
    }
  }
  return ctx.color;
}`
