import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import KartuKandidat from './KartuKandidat'
import FormMasuk from './FormMasuk'
import BilikSuara from './BilikSuara'
import './App.css'

const KODE_SEKOLAH = 'smpn2semanding'

function App() {
  const [sekolah, setSekolah] = useState(null)
  const [pesanError, setPesanError] = useState('')
  const [halaman, setHalaman] = useState('beranda') // beranda | masuk | bilik | selesai
  const [pemilih, setPemilih] = useState(null)
  const [pesanSelesai, setPesanSelesai] = useState('')

  useEffect(() => {
    async function ambilData() {
      const { data, error } = await supabase
        .from('sekolah')
        .select('nama, pemilu ( id, judul, periode, status, kandidat ( * ) )')
        .eq('kode', KODE_SEKOLAH)
        .single()

      if (error) {
        setPesanError('Gagal mengambil data: ' + error.message)
      } else {
        setSekolah(data)
      }
    }
    ambilData()
  }, [])

  if (pesanError) {
    return <main className="halaman"><p className="pesan-error">{pesanError}</p></main>
  }
  if (!sekolah) {
    return <main className="halaman"><p className="subjudul">Memuat data...</p></main>
  }

  const pemilu = sekolah.pemilu[0]
  const daftarKandidat = pemilu
    ? [...pemilu.kandidat].sort((a, b) => a.nomor_urut - b.nomor_urut)
    : []

  // Dipanggil setelah NIS & token benar
  function setelahMasuk(dataPemilih) {
    if (dataPemilih.sudah_memilih) {
      setPesanSelesai('Anda sudah memberikan suara sebelumnya. Terima kasih!')
      setHalaman('selesai')
    } else if (dataPemilih.status_pemilu !== 'dibuka') {
      setPesanSelesai('Bilik suara belum dibuka atau sudah ditutup.')
      setHalaman('selesai')
    } else {
      setPemilih(dataPemilih)
      setHalaman('bilik')
    }
  }

  // Dipanggil setelah suara berhasil terkirim
  function setelahMemilih(pesan) {
    setPemilih(null) // hapus NIS & token dari memori
    setPesanSelesai(pesan)
    setHalaman('selesai')
  }

  function kembaliKeBeranda() {
    setPemilih(null)
    setPesanSelesai('')
    setHalaman('beranda')
  }

  return (
    <main className="halaman">
      <h1>🗳️ PEMILU OSIS {sekolah.nama.toUpperCase()}</h1>

      {halaman === 'beranda' && (
        <>
          <p className="subjudul">Pilih ketua OSIS secara online, jujur, dan rahasia.</p>
          {pemilu ? (
            <>
              <h2>{pemilu.judul} {pemilu.periode}</h2>
              <div className="daftar-kandidat">
                {daftarKandidat.map((k) => (
                  <KartuKandidat key={k.id} kandidat={k} />
                ))}
              </div>
              {pemilu.status === 'dibuka' ? (
                <button className="tombol-utama" onClick={() => setHalaman('masuk')}>
                  Masuk untuk Memilih
                </button>
              ) : (
                <p className="subjudul">Bilik suara belum dibuka.</p>
              )}
            </>
          ) : (
            <p className="subjudul">Belum ada pemilu yang diumumkan.</p>
          )}
        </>
      )}

      {halaman === 'masuk' && (
        <FormMasuk kodeSekolah={KODE_SEKOLAH} onBerhasil={setelahMasuk} onBatal={kembaliKeBeranda} />
      )}

      {halaman === 'bilik' && (
        <BilikSuara
          kodeSekolah={KODE_SEKOLAH}
          pemilih={pemilih}
          daftarKandidat={daftarKandidat}
          onSelesai={setelahMemilih}
        />
      )}

      {halaman === 'selesai' && (
        <section className="kotak-form">
          <p className="pesan-sukses">{pesanSelesai}</p>
          <button className="tombol-utama" onClick={kembaliKeBeranda}>Kembali ke Beranda</button>
        </section>
      )}

      <p className="catatan">Versi uji coba 0.4</p>
    </main>
  )
}

export default App
