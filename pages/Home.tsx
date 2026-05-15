import { useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Subsidiaries from "../components/Subsidiaries";
import JointVentures from "../components/JointVentures";
import Collaborations from "../components/Collaborations";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

interface HomeProps {
  speed: number;
  lineCount: number;
  amplitude: number;
  yOffset: number;
  opacity: number;
}

export default function Home({
  speed,
  lineCount,
  amplitude,
  yOffset,
  opacity
}: HomeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformLocationsRef = useRef<Record<string, WebGLUniformLocation | null>>({});

  // Vertex shader
  const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0, 1);
    }
  `;

  // Fragment shader - Creates the wave pattern on the gpu
  const fragmentShaderSource = `
    precision mediump float;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float uSpeed;
    uniform float uLineCount;
    uniform float uAmplitude;
    uniform float uYOffset;
    uniform float uOpacity;

    // Use a constant upper bound for the loop
    const float MAX_LINES = 20.0;

    // Create a wavy line (0.0 black, 1.0 white)
    float wave(vec2 uv, float speed, float yPos, float thickness, float softness) {
      float falloff = smoothstep(1., 0.5, abs(uv.x));
      float y = falloff * sin(iTime * speed + uv.x * 10.0) * yPos - uYOffset;
      return 1.0 - smoothstep(thickness, thickness + softness + falloff * 0.0, abs(uv.y - y));
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.y;
      vec4 col = vec4(0.0, 0.0, 0.0, 1.0);

      // Background gradient - darker colors for less distraction
      vec3 gradCol1 = vec3(0.05, 0.02, 0.08);
      vec3 gradCol2 = vec3(0.07, 0.01, 0.12);
      col.xyz = mix(gradCol1, gradCol2, uv.x + uv.y);

      // Center uv coords
      uv -= 0.5;
      
      // Wave colors to interpolate between - more subtle
      const vec3 col1 = vec3(0.12, 0.2, 0.4);
      const vec3 col2 = vec3(0.4, 0.1, 0.4);

      // Used to antialias the lines based on display pixel density
      float aaDy = iResolution.y * 0.000005;
      
      for (float i = 0.; i < MAX_LINES; i += 1.) {
        // Only process if within our desired line count
        if (i <= uLineCount) {
          float t = i / (uLineCount - 1.0);
          vec3 lineCol = mix(col1, col2, t);
          float bokeh = pow(t, 3.0);
          float thickness = 0.002;
          float softness = aaDy + bokeh * 0.15;
          float amp = uAmplitude - 0.05 * t;
          float amt = max(0.0, pow(1.0 - bokeh, 2.0) * 0.7 * uOpacity);
          col.xyz += wave(uv, uSpeed * (1.0 + t), uAmplitude, thickness, softness) * lineCol * amt;
        }
      }

      gl_FragColor = col;
    }
  `;

  // Initialize WebGL
  const initWebGL = () => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    // Get WebGL context
    const gl = (canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      console.error("WebGL not supported");
      return false;
    }
    glRef.current = gl;

    // Create and compile the vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return false;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(
        "Vertex shader compilation error:",
        gl.getShaderInfoLog(vertexShader)
      );
      return false;
    }

    // Create and compile the fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) return false;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(
        "Fragment shader compilation error:",
        gl.getShaderInfoLog(fragmentShader)
      );
      return false;
    }

    // Create and link the shader program
    const program = gl.createProgram();
    if (!program) return false;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(
        "Shader program linking error:",
        gl.getProgramInfoLog(program)
      );
      return false;
    }

    gl.useProgram(program);
    programRef.current = program;

    // Create a buffer for the vertex positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Rectangle covering the entire canvas (2 triangles)
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Setup attribute pointers
    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Save uniform locations
    uniformLocationsRef.current = {
      iResolution: gl.getUniformLocation(program, "iResolution"),
      iTime: gl.getUniformLocation(program, "iTime"),
      uSpeed: gl.getUniformLocation(program, "uSpeed"),
      uLineCount: gl.getUniformLocation(program, "uLineCount"),
      uAmplitude: gl.getUniformLocation(program, "uAmplitude"),
      uYOffset: gl.getUniformLocation(program, "uYOffset"),
      uOpacity: gl.getUniformLocation(program, "uOpacity"),
    };

    return true;
  };

  // Handle resizing
  const handleResize = () => {
    const canvas = canvasRef.current;
    const gl = glRef.current;

    if (!canvas || !gl) return;

    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if canvas is already the right size
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;

      // Update viewport
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
  };

  // Render the shader
  const render = () => {
    const gl = glRef.current;
    const program = programRef.current;
    const uniforms = uniformLocationsRef.current;

    if (!gl || !program) return;

    // Calculate elapsed time in seconds
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTimeRef.current) / 1000;

    // Set uniforms
    gl.uniform2f(uniforms.iResolution, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(uniforms.iTime, elapsedTime);
    gl.uniform1f(uniforms.uSpeed, speed);
    gl.uniform1f(uniforms.uLineCount, lineCount);
    gl.uniform1f(uniforms.uAmplitude, amplitude);
    gl.uniform1f(uniforms.uYOffset, yOffset);
    gl.uniform1f(uniforms.uOpacity, opacity);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Request next frame
    animationFrameRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    // Initialize WebGL on mount
    if (initWebGL()) {
      handleResize();
      render();

      // Add resize listener
      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, []);

  // Update parameters when they change
  useEffect(() => {
    const gl = glRef.current;
    const uniforms = uniformLocationsRef.current;

    if (gl && uniforms.uSpeed) {
      gl.uniform1f(uniforms.uSpeed, speed);
      gl.uniform1f(uniforms.uLineCount, lineCount);
      gl.uniform1f(uniforms.uYOffset, yOffset);
      gl.uniform1f(uniforms.uAmplitude, amplitude);
      gl.uniform1f(uniforms.uOpacity, opacity);
    }
  }, [speed, lineCount, amplitude, yOffset, opacity]);

  return (
    <div className="relative min-h-screen w-full bg-[#050108]">
      {/* Gradient Shader Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ display: "block" }}
        />
      </div>
      
      {/* Website Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Subsidiaries />
        <JointVentures />
        <Collaborations />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}