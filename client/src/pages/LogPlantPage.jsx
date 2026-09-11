import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCamera, FiImage, FiUploadCloud, FiX } from "react-icons/fi";
import { identifyPlant } from "../api/plantApi";

export default function LogPlantPage() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const identifyMutation = useMutation({
        mutationFn: identifyPlant,
        onSuccess: (analysis) => navigate("/plants/new/preview", { state: { analysis } }),
        onError: (error) => console.error("Plant identification failed:", error),
    });

    const handleImageSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return alert("Please select an image file.");
        if (file.size > 5 * 1024 * 1024) return alert("Please choose an image smaller than 5 MB.");

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const removeImage = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setImageFile(null);
        setPreviewUrl("");
    };

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <Link to="/garden" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-white hover:text-emerald-800">
                <FiArrowLeft /> Back to garden
            </Link>

            <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-stone-900/5 ring-1 ring-stone-200/60">
                <div className="bg-gradient-to-r from-emerald-700 to-green-600 px-7 py-8 text-white sm:px-10">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15"><FiCamera size={26} /></div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">Add a plant</p>
                            <h1 className="mt-1 text-3xl font-black tracking-tight">Let GreenGuru identify it</h1>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50">Upload a clear photo. We’ll identify the plant and prepare its care guide before it is added to your garden.</p>
                        </div>
                    </div>
                </div>

                <div className="p-7 sm:p-10">
                    {!previewUrl ? (
                        <label className="flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 px-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50">
                            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm"><FiUploadCloud size={30} /></span>
                            <p className="mt-5 text-base font-bold text-forest-800">Choose a plant photo</p>
                            <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500">For the best result, include the leaves, stems, and overall shape in good lighting.</p>
                            <span className="mt-5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm">Select image</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} disabled={identifyMutation.isPending} />
                        </label>
                    ) : (
                        <div className="space-y-5">
                            <div className="relative overflow-hidden rounded-3xl bg-stone-100">
                                <img src={previewUrl} alt="Selected plant" className="max-h-[460px] w-full object-cover" />
                                {!identifyMutation.isPending && <button type="button" onClick={removeImage} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75" aria-label="Remove selected image"><FiX size={20} /></button>}
                            </div>
                            <div className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600"><FiImage className="text-emerald-700" /><span className="truncate font-medium">{imageFile?.name}</span></div>
                        </div>
                    )}

                    {identifyMutation.isError && <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700">We couldn’t analyze this photo. Please try another clear plant image.</div>}

                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link to="/garden" className="rounded-xl px-5 py-3 text-center text-sm font-bold text-stone-600 transition hover:bg-stone-100">Cancel</Link>
                        <button type="button" onClick={() => identifyMutation.mutate(imageFile)} disabled={!imageFile || identifyMutation.isPending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#31553b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#27452f] disabled:cursor-not-allowed disabled:opacity-50">
                            <FiCamera /> {identifyMutation.isPending ? "Analyzing your plant..." : "Analyze plant"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
