// Satu kartu untuk satu pasangan calon
function KartuKandidat({ kandidat }) {
  // Misi disimpan per baris, kita pecah jadi daftar
  const daftarMisi = (kandidat.misi || '')
    .split('\n')
    .filter((baris) => baris.trim() !== '')

  // Huruf pertama nama, dipakai kalau belum ada foto
  const inisial = kandidat.nama.charAt(0)

  return (
    <article className="kartu-kandidat">
      <div className="nomor-urut">{kandidat.nomor_urut}</div>

      {kandidat.foto_url ? (
        <img className="foto" src={kandidat.foto_url} alt={'Foto ' + kandidat.nama} />
      ) : (
        <div className="foto foto-kosong">{inisial}</div>
      )}

      <h3>{kandidat.nama}</h3>
      <p className="kelas">Kelas {kandidat.kelas}</p>
      {kandidat.nama_wakil && (
        <p className="wakil">Wakil: {kandidat.nama_wakil} ({kandidat.kelas_wakil})</p>
      )}

      <h4>Visi</h4>
      <p>{kandidat.visi}</p>

      <h4>Misi</h4>
      <ul>
        {daftarMisi.map((misi, i) => (
          <li key={i}>{misi}</li>
        ))}
      </ul>
    </article>
  )
}

export default KartuKandidat