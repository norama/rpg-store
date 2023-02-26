export const addCollapseHandler = () => {
  const coll = document.getElementsByClassName('collapsible')

  for (let i = 0; i < coll.length; i++) {
    if (coll[i].classList.contains('active')) {
      const content = coll[i].nextElementSibling as HTMLElement
      content.style.maxHeight = content.scrollHeight + 'px'
      content.style.overflow = 'visible'
    }

    coll[i].addEventListener('mousedown', function () {
      this.classList.toggle('active')
      const content = this.nextElementSibling
      if (content.style.maxHeight) {
        content.style.maxHeight = null
        content.style.overflow = 'hidden'
      } else {
        content.style.maxHeight = content.scrollHeight + 'px'
        content.style.overflow = 'visible'
      }
    })
  }
}
