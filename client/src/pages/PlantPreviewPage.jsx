import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiDroplet, FiMapPin, FiSun } from "react-icons/fi";
import { createPlant } from "../api/plantApi";

function formatStatus(status) {
    return status ? status.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "Unknown";
}

export default function PlantPreviewPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const analysis = location.state?.analysis;
    const [form, setForm] = useState({ nickname: "", commonName: analysis?.commonName || "", scientificName: analysis?.scientificName || "", location: "Indoors", lastWatered: "" });

    const createMutation = useMutation({
        mutationFn: createPlant,
        onSuccess: (plant) => navigate(`/plants/${plant._id}`, { replace: true }),
        onError: (error) => console.error("Plant creation failed:", error),
    });

    if (!analysis) {
        return (
            <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl shadow-stone-900/5 ring-1 ring-stone-200/60">
                <div className="text-5xl">🌱</div>
                <h1 className="mt-4 text-2xl font-bold text-forest-800">Choose a photo first</h1>
                <p className="mt-2 text-sm text-stone-500">A plant preview is created after GreenGuru analyzes an image.</p>
                <Link to="/plants/new" className="mt-6 inline-flex rounded-xl bg-[#31553b] px-5 py-3 text-sm font-bold text-white">Add a plant</Link>
            </div>
        );
    }

    const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    const handleSubmit = (event) => {
        event.preventDefault();
        createMutation.mutate({ ...analysis, ...form, nickname: form.nickname.trim(), lastWatered: form.lastWatered || null });
    };
    const confidence = analysis.aiConfidence === null || analysis.aiConfidence === undefined ? null : Math.round(analysis.aiConfidence * 100);

    return (
        <div className="mx-auto max-w-5xl space-y-7">
            <Link to="/plants/new" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-white hover:text-emerald-800"><FiArrowLeft /> Choose another photo</Link>

            <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-stone-900/5 ring-1 ring-stone-200/60">
                <div className="border-b border-stone-100 px-7 py-7 sm:px-10">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Plant preview</p>
                    <h1 className="mt-1 text-3xl font-black tracking-tight text-forest-800">Review before adding to your garden</h1>
                    <p className="mt-2 text-sm text-stone-500">You can adjust the display names and personal details; GreenGuru manages the rest.</p>
                </div>

                <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="bg-stone-50 p-7 sm:p-10">
                        <img src={analysis.imageUrl} alt={analysis.commonName || "Plant analysis"} className="h-72 w-full rounded-3xl object-cover shadow-md sm:h-[420px]" />
                        <div className="mt-5 rounded-2xl bg-white p-5 ring-1 ring-stone-200/60">
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">AI result</p>
                            <h2 className="mt-1 text-2xl font-black text-forest-800">{analysis.commonName || "Plant not identified"}</h2>
                            {analysis.scientificName && <p className="mt-1 text-sm italic text-stone-500">{analysis.scientificName}</p>}
                            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                                {confidence !== null && <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-800">{confidence}% confidence</span>}
                                <span className="rounded-full bg-stone-100 px-3 py-1.5 text-stone-600">{formatStatus(analysis.healthStatus)}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 p-7 sm:p-10">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Info icon={<FiDroplet />} label="Watering" value={analysis.careInfo?.waterFrequency} />
                            <Info icon={<FiSun />} label="Sunlight" value={analysis.careInfo?.sunlight} />
                        </div>

                        <div className="rounded-2xl bg-emerald-50 p-5 text-sm leading-6 text-emerald-900 ring-1 ring-emerald-100">
                            <p className="font-bold">AI observation</p>
                            <p className="mt-1">{analysis.aiObservation || "No health observation is available."}</p>
                            {analysis.actionableFix && <p className="mt-3 font-medium">Next step: {analysis.actionableFix}</p>}
                        </div>

                        <div className="space-y-4 border-t border-stone-100 pt-6">
                            <h2 className="text-lg font-bold text-forest-800">Your plant details</h2>
                            <Field label="Nickname" name="nickname" value={form.nickname} onChange={handleChange} required placeholder="e.g. Sunny" />
                            <Field label="Common name" name="commonName" value={form.commonName} onChange={handleChange} />
                            <Field label="Scientific name" name="scientificName" value={form.scientificName} onChange={handleChange} italic />
                            <div>
                                <label htmlFor="location" className="mb-1.5 block text-sm font-bold text-stone-700"><FiMapPin className="mr-1 inline text-emerald-700" />Location</label>
                                <select id="location" name="location" value={form.location} onChange={handleChange} className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-emerald-500">
                                    <option value="Indoors">Indoors</option><option value="Outdoors">Outdoors</option><option value="Living room">Living room</option><option value="Balcony">Balcony</option><option value="Garden">Garden</option><option value="Other">Other</option>
                                </select>
                            </div>
                            <Field label="Last watered (optional)" name="lastWatered" type="date" value={form.lastWatered} onChange={handleChange} />
                        </div>

                        {createMutation.isError && <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">We couldn’t add this plant. Please try again.</p>}
                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                            <Link to="/plants/new" className="rounded-xl px-5 py-3 text-center text-sm font-bold text-stone-600 transition hover:bg-stone-100">Cancel</Link>
                            <button type="submit" disabled={createMutation.isPending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#31553b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#27452f] disabled:cursor-not-allowed disabled:opacity-50"><FiCheck />{createMutation.isPending ? "Adding plant..." : "Add to my garden"}</button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}

function Info({ icon, label, value }) {
    return <div className="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-100"><div className="flex items-center gap-2 text-emerald-700">{icon}<span className="text-xs font-bold uppercase tracking-wider">{label}</span></div><p className="mt-2 text-sm font-semibold text-stone-700">{value || "Not available"}</p></div>;
}

function Field({ label, name, type = "text", value, onChange, required, placeholder, italic = false }) {
    return <div><label htmlFor={name} className="mb-1.5 block text-sm font-bold text-stone-700">{label}</label><input id={name} name={name} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} className={`w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none focus:border-emerald-500 ${italic ? "italic" : ""}`} /></div>;
}
