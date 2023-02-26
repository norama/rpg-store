export const rowFilter = (filter: (id: string) => boolean) => {
  const infoTable = document.getElementById('infoTable')
  const infoRows = infoTable.querySelector('tbody').getElementsByTagName('tr')
  for (let row of infoRows) {
    if (filter(row.id)) {
      row.style.display = 'table-row'
    } else {
      row.style.display = 'none'
    }
  }
}
