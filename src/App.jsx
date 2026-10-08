import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

const KODE_SEKOLAH = 'smpn2semanding'

function App() {
  const [sekolah, setSekolah] = useState(null)
  const [pesanError, setPesanError] = useState('')

  useEffect(() => {
    async function ambilSekolah() {
      const { data, error } = await supabase
        .from('sekolah')
        .select('nama')
        .eq('kode', KODE_SEKOLAH)
        .single()

      if (error) {
        setPesanError('Gagal mengambil data sekolah: ' + error.message)
      } else {
        setSekolah(data)
      }
    }
    ambilSekolah()
  }, [])

  return (
    <main className="halaman">
      <h1>🗳️ PEMILU OSIS {sekolah ? sekolah.nama.toUpperCase() : '...'}</h1>
      {pesanError && <p className="pesan-error">{pesanError}</p>}
      <p className="subjudul">Pilih ketua OSIS secara online, jujur, dan rahasia.</p>
      <button className="tombol-utama">Masuk untuk Memilih</button>
      <p className="subjudul">Versi uji coba 0.2 · Data sekolah diambil dari database</p>
    </main>
  )
}

export default App