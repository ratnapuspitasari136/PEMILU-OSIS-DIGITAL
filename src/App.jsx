import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import FormMasuk from './FormMasuk'
import MenuOrganisasi from './MenuOrganisasi'
import BilikSuara from './BilikSuara'
import './App.css'

const KODE_SEKOLAH = 'smpn2semanding'

function App() {
  const [sekolah, setSekolah] = useState(null)
  const [pesanError, setPesanError] = useState('')
  const [halaman, setHalaman] = useState('login') // login | menu | bilik
  const [pemilih, setPemilih] = useState(null)
  const [organisasiAktif, setOrganisasiAktif] = useState(null)
  const [pesanInfo, setPesanInfo] = useState('')

  useEffect(() => {
    async function ambilData() {
      // Ambil sekolah → pemilu → organisasi → kandidat sekaligus
      const { data, error } = await supabase
        .from('sekolah')
        .select('nama, pemilu ( id, judul, periode, status, organisasi ( id, nama, jabatan, urutan, kandidat ( * ) ) )')
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
  const daftarOrganisasi = pemilu
    ? [...pemilu.organisasi].sort((a, b) => a.urutan - b.urutan)
    : []

  // Setelah NIS & token benar → ke menu organisasi
  function setelahMasuk(dataPemilih) {
    setPemilih(dataPemilih)
    setPesanInfo('')
    setHalaman('menu')
  }

  // Siswa memilih organisasi di menu → buka surat suaranya
  function bukaBilik(org) {
    setOrganisasiAktif(org)
    setPesanInfo('')
    setHalaman('bilik')
  }

  // Setelah suara terkirim → tandai organisasi itu ✅, kembali ke menu
  function setelahMemilih(pesan) {
    setPemilih({
      ...pemilih,
      sudah_dipilih: [...pemilih.sudah_dipilih, organisasiAktif.id],
    })
    setPesanInfo(`${pesan} (${organisasiAktif.jabatan})`)
    setOrganisasiAktif(null)
    setHalaman('menu')
  }

  // Keluar → hapus NIS & token dari memori
  function keluar() {
    setPemilih(null)
    setOrganisasiAktif(null)
    setPesanInfo('')
    setHalaman('login')
  }

  return (
    <main className="halaman">
      <h1>🗳️ PEMILU {sekolah.nama.toUpperCase()}</h1>

      {!pemilu ? (
        <p className="subjudul">Belum ada pemilu yang diumumkan.</p>
      ) : (
        <>
          <p className="subjudul">{pemilu.judul} · Periode {pemilu.periode}</p>

          {halaman === 'login' && (
            <FormMasuk kodeSekolah={KODE_SEKOLAH} onBerhasil={setelahMasuk} />
          )}

          {halaman === 'menu' && (
            <MenuOrganisasi
              pemilih={pemilih}
              statusPemilu={pemilu.status}
              daftarOrganisasi={daftarOrganisasi}
              pesanInfo={pesanInfo}
              onPilihOrganisasi={bukaBilik}
              onKeluar={keluar}
            />
          )}

          {halaman === 'bilik' && (
            <BilikSuara
              kodeSekolah={KODE_SEKOLAH}
              pemilih={pemilih}
              organisasi={organisasiAktif}
              onSelesai={setelahMemilih}
              onKembali={() => setHalaman('menu')}
            />
          )}
        </>
      )}

      <p className="catatan">Versi uji coba 0.5</p>
    </main>
  )
}

export default App
