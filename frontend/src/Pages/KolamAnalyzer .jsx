import React, { useState, useRef } from "react";

const regions = ["Tamil Nadu", "Karnataka", "Andhra Pradesh"];
const styles = ["Pulli", "Freehand", "Rangoli", "Symmetry"];

const KolamGenerator = () => {
  const fileInputRef = useRef(null);

  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    m: 5,
    n: 5,
    region: "Tamil Nadu",
    style: "Pulli",
    color: 50,
    size: 32,
    complexity: 75,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState({
    imageBase64: null,
    svgText: null,
    insights: null,
  });
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("preview");

  const sliders = [
    { key: "color", label: "Color Intensity", icon: "🎨" },
    { key: "size", label: "Pattern Size", icon: "📐" },
    { key: "complexity", label: "Complexity", icon: "✨" },
  ];

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setImageFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const generateKolam = async () => {
    setLoading(true);
    setError(null);
    setOutput({ imageBase64: null, svgText: null, insights: null });

    try {
      const body = imageFile ? new FormData() : JSON.stringify(form);
      const headers = imageFile ? {} : { "Content-Type": "application/json" };

      if (imageFile) body.append("image", imageFile);

      const res = await fetch("https://kolam-backend-7oou.onrender.com/api/generate", {
        method: "POST",
        headers,
        body,
      });

      if (!res.ok)
        throw new Error(
          (await res.json()).detail || "Failed to generate Kolam"
        );

      const data = await res.json();
      setOutput({
        imageBase64: data.image_base64,
        svgText: data.svg,
        insights: data.insights,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (type) => {
    if (!output[type]) return;
    const blob =
      type === "svgText"
        ? new Blob([output.svgText], { type: "image/svg+xml" })
        : null;
    const url =
      type === "svgText"
        ? URL.createObjectURL(blob)
        : `data:image/png;base64,${output.imageBase64}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `kolam-${form.region}-${form.style}.${
      type === "svgText" ? "svg" : "png"
    }`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (blob) URL.revokeObjectURL(url);
  };

  const formatInsights = (insights) =>
    !insights
      ? "No insights"
      : Object.entries(insights).map(([k, v]) => (
          <div key={k}>
            <span className="font-semibold">{k.replace(/_/g, " ")}:</span>{" "}
            <span className="ml-2">
              {typeof v === "object" ? JSON.stringify(v, 2) : v}
            </span>
          </div>
        ));

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#EDE1D8] via-[#F5ECE4] to-[#E8D9CD] text-[#4C290C]">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#4C290C] to-[#A24C1D] bg-clip-text text-transparent mb-2">
          Kolam AI Generator
        </h1>
        <p className="text-stone-600 text-sm md:text-base">
          Create beautiful traditional Kolam patterns using AI. Upload an image
          or adjust parameters manually.
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1 bg-white/90 backdrop-blur-lg p-6 rounded-2xl border border-[#D9CFC0] shadow-lg space-y-6">
          <h2 className="text-xl font-semibold border-b border-[#D9CFC0] pb-3 mb-4">
            Design Parameters / Upload Image
          </h2>

          {/* Image Upload */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragOver
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-white/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src="/upload-cloud-icon.png"
              alt="Upload"
              className="mx-auto mb-4 w-12 h-12 opacity-70"
            />
            <p className="text-gray-600 mb-2">Drag & Drop a file here</p>
            <button
              type="button"
              className="text-green-500 font-medium border border-green-500 px-4 py-1 rounded hover:bg-green-50 transition"
            >
              IMPORT FROM
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            {imageFile && (
              <p className="text-sm text-gray-600 mt-2">{imageFile.name}</p>
            )}
          </div>
          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-400" />
            <span className="px-2 text-gray-600 font-bold">OR</span>
            <hr className="flex-grow border-t border-gray-400" />
          </div>

          {/* Only show form if no image uploaded */}
          {!imageFile && (
            <>
              {/* Grid Size */}
              <div className="grid grid-cols-2 gap-4">
                {["m", "n"].map((k) => (
                  <div key={k} className="space-y-2">
                    <label className="text-sm font-medium">
                      {k === "m" ? "Rows" : "Columns"}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={form[k]}
                      onChange={(e) =>
                        handleChange(
                          k,
                          Math.max(1, Math.min(20, Number(e.target.value)))
                        )
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#C8B8A6]"
                    />
                  </div>
                ))}
              </div>

              {/* Region & Style */}
              {["region", "style"].map((k) => (
                <div key={k} className="space-y-2">
                  <label className="text-sm font-medium">
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </label>
                  <select
                    value={form[k]}
                    onChange={(e) => handleChange(k, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#C8B8A6]"
                  >
                    {(k === "region" ? regions : styles).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Sliders */}
              {sliders.map(({ key, label, icon }) => (
                <div key={key} className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="flex items-center gap-1 font-medium">
                      {icon} {label}
                    </label>
                    <span className="text-xs">{form[key]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form[key]}
                    onChange={(e) => handleChange(key, Number(e.target.value))}
                    className="w-full h-2 rounded-lg accent-[#4C290C]"
                  />
                </div>
              ))}
            </>
          )}

          <div className="flex gap-2">
            <button
              onClick={generateKolam}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#4C290C] to-[#A24C1D] text-white py-3 rounded-xl font-semibold hover:scale-[1.02] transition-transform"
            >
              {loading ? "Generating..." : "✨ Generate Kolam"}
            </button>
            {imageFile && (
              <button
                onClick={() => {
                  setImageFile(null);
                  setForm({
                    m: 5,
                    n: 5,
                    region: "Tamil Nadu",
                    style: "Pulli",
                    color: 50,
                    size: 32,
                    complexity: 75,
                  });
                  setOutput({
                    imageBase64: null,
                    svgText: null,
                    insights: null,
                  });
                  setError(null);
                }}
                className="px-4 py-3 border rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {output.imageBase64 ? (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-[#D9CFC0] shadow-lg">
              {/* Tabs */}
              <div className="border-b border-[#D9CFC0] flex">
                {["preview", "insights"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-3 ${
                      tab === t
                        ? "bg-[#4C290C] text-white"
                        : "text-[#4C290C]/70 hover:bg-white/50"
                    }`}
                  >
                    {t === "preview" ? "👁️ Preview" : "📊 Insights"}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {tab === "preview" && (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center gap-3 mb-4">
                      <button
                        onClick={() => downloadFile("imageBase64")}
                        className="px-4 py-2 bg-[#4C290C] text-white rounded hover:bg-[#5C3410]"
                      >
                        📥 PNG
                      </button>
                      <button
                        onClick={() => downloadFile("svgText")}
                        className="px-4 py-2 border border-[#4C290C] text-[#4C290C] rounded hover:bg-[#F5ECE4]"
                      >
                        📥 SVG
                      </button>
                    </div>
                    <img
                      src={`data:image/png;base64,${output.imageBase64}`}
                      alt="Kolam"
                      className="max-w-full h-auto rounded shadow-sm"
                    />
                  </div>
                )}

                {tab === "insights" && (
                  <div className="bg-[#F5ECE4] p-4 rounded-lg">
                    {formatInsights(output.insights)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-lg border-2 border-dashed border-[#D9CFC0] p-12 text-center min-h-[400px] flex items-center justify-center">
              <div className="text-[#A24C1D]">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">
                  No Kolam Generated Yet
                </h3>
                <p>
                  Upload an image or adjust parameters and click "Generate
                  Kolam"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KolamGenerator;
