/* global alert, document, window, __DEFAULT_RULES__, __RULES__ */

const styles = host => __DEFAULT_RULES__.concat(
  __RULES__.find( r => host.endsWith(r.domain) ).rules
)

const togglePlayer = () => {
  const { classList } = document.body
  console.info(
    (classList.contains('fwplayer') ? 'disabling' : 'enabling') + ' FWP'
  )
  classList.toggle('fwplayer')
}

function setup (list) {
  console.info('Initializing FWP')
  const styleTag = document.createElement('style')
  styleTag.id = 'fw-player-styles'
  styleTag.type = 'text/css'
  document.head.appendChild(styleTag)

  const toggle = document.createElement('button')
  toggle.id = 'fw-player-toggle'
  toggle.innerText='X'
  document.body.appendChild(toggle)

  toggle.addEventListener('click', togglePlayer)

  styles(window.location.host)
    .forEach( r => styleTag.sheet.insertRule(r) )

  list.add('fwplayer-available')
  list.add('fwplayer')
}

if (document.body.classList.contains('fwplayer-available')) {
  togglePlayer()
} else {
  try {
    setup(document.body.classList)
  } catch (err) {
    alert('Could not setup player :(')
    console.error(err)
  }
}