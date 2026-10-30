"use client";

import { Building2, ClipboardList, Layers, MapPin } from "lucide-react";
import { activities } from "@/lib/activities";
import { OFFICES } from "@/lib/config";
import { licenseCategories, plusServices } from "@/lib/content";
import { CountUp } from "./motion";

const facts = [
  { icon: Layers, value: licenseCategories.length, label: "Licence categories" },
  { icon: ClipboardList, value: activities.length, label: "Business activities listed" },
  { icon: Building2, value: plusServices.length, label: "Support services" },
  { icon: MapPin, value: OFFICES.length, label: "UAE offices" },
];

export default function Facts() {
  return (
    <section className="relative z-10 -mt-28 px-6 pb-8 sm:px-12 lg:px-16">
      <dl className="mx-auto grid max-w-[1840px] grid-cols-1 gap-px overflow-hidden rounded-2xl bg-line shadow-[0_30px_70px_-30px_rgba(11,37,69,0.45)] sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} data-spotlight className="group spotlight flex items-center gap-5 bg-white p-6 sm:p-8">
            <span className="gold-gradient flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-midnight transition duration-500 group-hover:-rotate-12 group-hover:scale-125">
              <f.icon className="h-6 w-6" />
            </span>
            <div>
              <dt className="font-display text-[34px] font-bold leading-none text-navy">
                <CountUp to={f.value} />
              </dt>
              <dd className="mt-2 text-[15px] font-semibold text-body">{f.label}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
