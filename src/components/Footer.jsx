import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/[0.08] bg-clinical-950/60 py-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div>
          <p className="font-medium text-slate-400">
            Trustworthy Artificial Intelligence (TAI) Capstone Audit
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Atal Bihari Vajpayee Indian Institute of Information Technology and Management (ABV-IIITM), Gwalior
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
            Madry et al. (ICLR 2018)
          </span>
          <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
            Tsipras et al. (ICLR 2019)
          </span>
          <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
            Adebayo et al. (NeurIPS 2018)
          </span>
        </div>

      </div>
    </footer>
  )
}
