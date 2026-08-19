'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Box, Store, Smartphone, Tag, FileText, CheckCircle2, ArrowRight, Lightbulb, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      title: 'Modul 1: Hitung HPP Murni per Porsi',
      icon: Box,
      badge: 'Langkah Awal (Wajib)',
      desc: 'Masukkan modal bersih 0% risiko yang terdiri dari 3 pilar SAK EMKM.',
      details: [
        {
          title: '1. Bahan Baku Utama (Direct Materials)',
          text: 'Isi nama bahan, total harga beli, dan berapa porsi yang dihasilkan. Contoh: Ayam 1 kg harga Rp 40.000 untuk 5 porsi → modal bahan = Rp 8.000/porsi.'
        },
        {
          title: '2. BOP Variabel / Utilitas (Gas, Listrik, Air)',
          text: 'Isi kapasitas total beli, harga, dan pemakaian per resep. Contoh: Gas LPG Rp 21.000 (3 kg/3000 gr), sekali masak pakai 300 gr untuk 5 porsi → modal gas = Rp 420/porsi.'
        },
        {
          title: '3. Kemasan (Packaging)',
          text: 'Isi harga beli pack dan jumlah isi. Contoh: Lunch Box Rp 50.000 isi 50 pcs → modal kemasan = Rp 1.000/porsi.'
        }
      ],
      tip: '💡 HPP Murni adalah modal riil kamu per porsi tanpa memasukkan keuntungan.'
    },
    {
      step: 2,
      title: 'Modul 2: Harga Jual Toko (Offline)',
      icon: Store,
      badge: 'Penjualan Toko / Dine-In',
      desc: 'Tentukan harga jual di kedai/outlet fisik berdasarkan standar Food Cost FnB.',
      details: [
        {
          title: 'Metode Target Food Cost (Direkomendasikan 35%)',
          text: 'Jika HPP Murni kamu Rp 10.000/porsi dan target Food Cost 35%, maka Harga Jual Toko = Rp 10.000 ÷ 35% = Rp 28.600 (dibulatkan sistem ke atas Rp 28.600 / Rp 29.000).'
        },
        {
          title: 'Metode Target Gross Margin (65%)',
          text: 'Menghitung dari porsi omset yang menjadi margin kotor kamu.'
        },
        {
          title: 'Metode Markup Traditional (Misal 100%)',
          text: 'Menambah persentase keuntungan langsung di atas HPP.'
        }
      ],
      tip: '💡 Standar industri kuliner sehat adalah Target Food Cost di kisaran 30% - 35%.'
    },
    {
      step: 3,
      title: 'Modul 3: Harga Aplikasi Online (Reverse Margin)',
      icon: Smartphone,
      badge: 'GoFood / GrabFood / ShopeeFood',
      desc: 'Cegah rugi akibat komisi platform dengan rumus Reverse Margin Akuntansi.',
      details: [
        {
          title: '⚠️ Kenapa Rumus "Harga Toko × 1.20" Salah & Bikin Boncos?',
          text: 'Komisi aplikasi (misal 20%) dipotong dari Harga Online (Harga Kotor), bukan dari harga offline. Jika harga toko Rp 20.000 dinaikkan 20% jadi Rp 24.000, komisi memotong Rp 4.800 → Uang cair bersih hanya Rp 19.200 (Rugi Rp 800!).'
        },
        {
          title: '✅ Rumus Reverse Margin Yang Benar',
          text: 'Sistem otomatis memakai rumus: (Harga Toko + Biaya Layanan) ÷ (1 - Komisi App). Jika toko Rp 20.000 dan komisi 20%, harga online = Rp 25.000. Komisi 20% dipotong Rp 5.000 → Uang cair pas Rp 20.000 (0% Rugi!).'
        }
      ],
      tip: '🛡️ Jika kamu mengedit harga online di bawah rekomendasi, sistem akan menampilkan Peringatan Anti-Boncos!'
    },
    {
      step: 4,
      title: 'Modul 4: Analisis Efek Promo & Diskon',
      icon: Tag,
      badge: 'Simulasi Promo App',
      desc: 'Uji apakah diskon promo toko atau promo aplikasi membuat kamu untung atau rugi.',
      details: [
        {
          title: '1. Simulasi Diskon Toko Offline',
          text: 'Uji diskon persen atau nominal dan lihat langsung "Harga Coret" yang aman dipasang.'
        },
        {
          title: '2. Simulasi Struk Promo Online App',
          text: 'Simulasikan kuantitas pesanan (misal 2 porsi) + diskon promo (misal 20%). Sistem menampilkan rincian struk: Total Dibayar Konsumen, Potongan Komisi App, Biaya Layanan, dan Net Payout Masuk Rekening.'
        }
      ],
      tip: '🟢 Jika Laba Bersih Promo bernilai positif (+), promo kamu aman untuk dijalankan.'
    },
    {
      step: 5,
      title: 'Modul 5: Ringkasan & AI Insights',
      icon: FileText,
      badge: 'Dashboard Eksekutif',
      desc: 'Dapatkan rangkuman lengkap 5 modul & rekomendasi otomatis dari Juragan AI Advisor.',
      details: [
        {
          title: '1. KPI Dashboard',
          text: 'Melihat Proyeksi Pendapatan, Rata-rata Profit Margin, dan Total HPP dalam satu tampilan.'
        },
        {
          title: '2. Profit Margin by Channel',
          text: 'Membandingkan keuntungan di kanal Offline vs Online vs Promo melalui grafik visual.'
        },
        {
          title: '3. Juragan AI Advisor',
          text: 'Klik tombol AI Advisor di pojok kanan atas untuk berkonsultasi strategi harga, efisiensi bahan baku, dan rekomendasi bisnis.'
        }
      ],
      tip: '🚀 Gunakan tombol "Resep Baru" di header untuk menambah menu resep kuliner lainnya!'
    }
  ];

  const current = steps.find(s => s.step === activeStep) || steps[0];
  const StepIcon = current.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white border-[#e0e3e5] p-0 overflow-hidden rounded-2xl shadow-xl">
        <DialogHeader className="p-6 bg-[#131b2e] text-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#e1e0ff]" />
              <DialogTitle className="font-heading text-xl font-bold text-white">
                Panduan Penggunaan Kalkulator UMKM Pintar
              </DialogTitle>
            </div>
            <Badge variant="secondary" className="bg-[#e1e0ff] text-[#07006c] font-bold text-[10px]">
              Standar SAK EMKM
            </Badge>
          </div>
          <DialogDescription className="text-xs text-[#bec6e0] font-medium">
            Pelajari alur kalkulasi sekuensial (Modul 1 → 5) agar bisnis kuliner kamu anti-boncos & untung maksimal.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Step Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#e0e3e5] pb-3">
            {steps.map(s => {
              const Icon = s.icon;
              const isActive = s.step === activeStep;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#131b2e] text-white shadow-xs'
                      : 'bg-[#f7f9fb] text-[#45464d] border border-[#e0e3e5] hover:bg-[#e0e3e5]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>Modul {s.step}</span>
                </button>
              );
            })}
          </div>

          {/* Active Step Content */}
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#e1e0ff] text-[#07006c] flex items-center justify-center font-bold">
                  <StepIcon className="h-4 w-4 text-[#4648d4]" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-[#191c1e]">{current.title}</h3>
                  <p className="text-xs text-[#45464d]">{current.desc}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] text-[#45464d] border-[#e0e3e5] font-semibold">
                {current.badge}
              </Badge>
            </div>

            <div className="space-y-3">
              {current.details.map((d, idx) => (
                <Card key={idx} className="bg-[#f7f9fb] border-[#e0e3e5] shadow-none">
                  <CardContent className="p-4 space-y-1 text-xs">
                    <h4 className="font-bold text-[#191c1e] text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#4648d4] shrink-0" />
                      <span>{d.title}</span>
                    </h4>
                    <p className="text-[#45464d] leading-relaxed pl-5">{d.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-[#e1e0ff]/60 border border-[#c0c1ff] text-xs font-semibold text-[#07006c] flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-[#4648d4] shrink-0" />
              <span>{current.tip}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#e0e3e5]">
            <Button
              variant="outline"
              disabled={activeStep === 1}
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
              className="text-xs font-semibold rounded-lg border-[#e0e3e5]"
            >
              Sebelumnya
            </Button>
            <span className="text-xs text-[#45464d] font-bold">
              Modul {activeStep} dari 5
            </span>
            {activeStep < 5 ? (
              <Button
                onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                className="bg-[#131b2e] hover:bg-[#2d3133] text-white text-xs font-semibold rounded-lg"
              >
                <span>Lanjut Modul {activeStep + 1}</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={onClose}
                className="bg-[#4648d4] hover:bg-[#6063ee] text-white text-xs font-semibold rounded-lg"
              >
                <span>Mulai Pakai Kalkulator</span>
                <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
