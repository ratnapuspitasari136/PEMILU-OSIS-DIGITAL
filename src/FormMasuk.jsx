import { useState } from 'react'
import { supabase } from './supabaseClient'

function FormMasuk({ kodeSekolah, onBerhasil, onBatal }) {
  const [nis, setNis] = useState('')
  const [token, setToken] = useState('')
  const [pesan, setPesan] = useState('')
  const [sedangProses, setSedangProses] = useState(false)

  async function kirim(e) {
    e.preventDefault() // cegah halaman ter-refresh saat form dikirim
    setPesan('')
    setSedangProses(true)

    // Panggil fungsi masuk_pemilih di Supabase
    const { data, error } = await supabase.rpc('masuk_pemilih', {
      p_kode_sekolah: kodeSekolah,
      p_nis: nis,
      p_token: token,
    })

    setSedangProses(false)

    if (error) {
      setPesan('Terjadi gangguan: ' + error.message)
    } else if (!data.ok) {
      setPesan(data.pesan)
    } else {
      onBerhasil({ ...data, nis, token })
    }
  }

  return (
    <form className="kotak-form" onSubmit={kirim}>
      <h2>Masuk ke Bilik Suara</h2>

      <label>
        NIS / NIP
        <input value={nis} onChange={(e) => setNis(e.target.value)} required autoComplete="off" />
      </label>

      <label>
        Token
        <input
          value={token}
          onChange={(e) => setToken(e.target.value.toUpperCase())}
          required
          autoComplete="off"
        />
      </label>

      {pesan && <p className="pesan-error">{pesan}</p>}

      <button className="tombol-utama" disabled={sedangProses}>
        {sedangProses ? 'Memeriksa...' : 'Masuk'}
      </button>
      <button type="button" className="tombol-teks" onClick={onBatal}>
        ← Kembali
      </button>
    </form>
  )
}

export default FormMasuk
