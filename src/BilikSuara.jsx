import { useState } from 'react'
import { supabase } from './supabaseClient'
import KartuKandidat from './KartuKandidat'

function BilikSuara({ kodeSekolah, pemilih, daftarKandidat, onSelesai }) {
  const [pilihan, setPilihan] = useState(null) // kandidat yang sedang dipilih
  const [pesan, setPesan] = useState('')
  const [sedangProses, setSedangProses] = useState(false)

  async function kirimSuara() {
    const yakin = window.confirm(
      `Anda memilih pasangan nomor ${pilihan.nomor_urut}: ${pilihan.nama}.\n\n` +
      `Suara tidak bisa diubah setelah dikirim. Lanjutkan?`
    )
    if (!yakin) return

    setSedangProses(true)
    setPesan('')

    // Panggil fungsi berikan_suara di Supabase
    const { data, error } = await supabase.rpc('berikan_suara', {
      p_kode_sekolah: kodeSekolah,
      p_nis: pemilih.nis,
      p_token: pemilih.token,
      p_kandidat_id: pilihan.id,
    })

    setSedangProses(false)

    if (error) {
      setPesan('Terjadi gangguan: ' + error.message)
    } else if (!data.ok) {
      setPesan(data.pesan)
    } else {
      onSelesai(data.pesan)
    }
  }

  return (
    <section>
      <h2>Halo, {pemilih.nama} 👋</h2>
      <p className="subjudul">Klik salah satu kartu untuk memilih, lalu tekan tombol Kirim Suara.</p>

      <div className="daftar-kandidat">
        {daftarKandidat.map((k) => (
          <div
            key={k.id}
            className={'pilihan' + (pilihan?.id === k.id ? ' terpilih' : '')}
            onClick={() => setPilihan(k)}
          >
            <KartuKandidat kandidat={k} />
          </div>
        ))}
      </div>

      {pesan && <p className="pesan-error">{pesan}</p>}

      <button className="tombol-utama" disabled={!pilihan || sedangProses} onClick={kirimSuara}>
        {sedangProses
          ? 'Mengirim...'
          : pilihan
            ? `Kirim Suara untuk No. ${pilihan.nomor_urut}`
            : 'Pilih salah satu kandidat'}
      </button>
    </section>
  )
}

export default BilikSuara
