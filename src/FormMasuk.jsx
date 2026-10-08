import { useState } from 'react'
import { supabase } from './supabaseClient'

function FormMasuk({ kodeSekolah, onBerhasil }) {
  const [peran, setPeran] = useState('pemilih') // pemilih | admin
  const [nis, setNis] = useState('')
  const [token, setToken] = useState('')
  const [pesan, setPesan] = useState('')
  const [sedangProses, setSedangProses] = useState(false)

  async function kirim(e) {
    e.preventDefault()
    setPesan('')
    setSedangProses(true)

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
    <div className="kotak-form">
      <div className="tab-peran">
        <button type="button" className={peran === 'pemilih' ? 'aktif' : ''} onClick={() => setPeran('pemilih')}>
          Pemilih
        </button>
        <button type="button" className={peran === 'admin' ? 'aktif' : ''} onClick={() => setPeran('admin')}>
          Admin
        </button>
      </div>

      {peran === 'pemilih' ? (
        <form className="isi-form" onSubmit={kirim}>
          <h2>Masuk sebagai Pemilih</h2>

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
        </form>
      ) : (
        <div className="isi-form">
          <h2>Masuk sebagai Admin</h2>
          <p className="subjudul">Login admin/panitia sedang dibuat dan akan tersedia di tahap berikutnya.</p>
        </div>
      )}
    </div>
  )
}

export default FormMasuk
