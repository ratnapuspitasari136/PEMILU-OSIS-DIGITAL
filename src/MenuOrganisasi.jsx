function MenuOrganisasi({ pemilih, statusPemilu, daftarOrganisasi, pesanInfo, onPilihOrganisasi, onKeluar }) {
  const jumlahSudah = daftarOrganisasi.filter((o) => pemilih.sudah_dipilih.includes(o.id)).length
  const semuaSelesai = jumlahSudah === daftarOrganisasi.length
  const bilikDibuka = statusPemilu === 'dibuka'

  return (
    <section>
      <h2>Halo, {pemilih.nama} 👋</h2>
      <p className="subjudul">
        {pemilih.kelas ? `Kelas ${pemilih.kelas} · ` : ''}
        Sudah memilih {jumlahSudah} dari {daftarOrganisasi.length} organisasi
      </p>

      {pesanInfo && <p className="pesan-sukses">{pesanInfo}</p>}
      {!bilikDibuka && <p className="pesan-error">Bilik suara sedang tidak dibuka.</p>}

      <div className="daftar-organisasi">
        {daftarOrganisasi.map((org) => {
          const sudah = pemilih.sudah_dipilih.includes(org.id)
          return (
            <button
              key={org.id}
              className={'kartu-organisasi' + (sudah ? ' sudah' : '')}
              disabled={sudah || !bilikDibuka}
              onClick={() => onPilihOrganisasi(org)}
            >
              <span className="nama-organisasi">{org.nama}</span>
              <span className="jabatan-organisasi">{org.jabatan}</span>
              <span className="status-organisasi">
                {sudah ? '✅ Sudah memilih' : `${org.kandidat.length} kandidat · Ketuk untuk memilih`}
              </span>
            </button>
          )
        })}
      </div>

      {semuaSelesai && (
        <p className="pesan-sukses">🎉 Terima kasih! Anda sudah memilih di semua organisasi.</p>
      )}

      <button className="tombol-teks" onClick={onKeluar}>Keluar</button>
    </section>
  )
}

export default MenuOrganisasi
