/*
 * Elfling festive layer
 * - "Sleeps until Christmas" countdown in the homepage hero
 * - Gentler snowfall that respects reduced-motion preferences, with a visitor on/off switch
 * - Keeps the dark mode switch in step when the theme follows the device setting
 *
 * Plain JavaScript, no build step. Loaded with `defer` after snowstorm.min.js and app.js.
 */
(function () {
  'use strict'

  var SNOW_STORAGE_KEY = 'elfling-snow'

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key)
    } catch (e) {
      return null
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value)
    } catch (e) {}
  }

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ---------------------------------------------------------------------
   * Snow
   * snowstorm.min.js has already run and registered its own window "load"
   * handler, so anything we set here applies before the first flake falls.
   * ------------------------------------------------------------------- */
  var snowMode = window.elflingSnowMode || 'everywhere'
  var storm = window.snowStorm

  function visitorWantsSnow() {
    var saved = storageGet(SNOW_STORAGE_KEY)
    if (saved === 'on') return true
    if (saved === 'off') return false
    // No saved choice: snow by default, unless the visitor prefers less motion
    return !prefersReducedMotion
  }

  if (storm && snowMode !== 'off') {
    storm.followMouse = false
    storm.flakesMaxActive = 48
    storm.vMaxX = 2
    storm.vMaxY = 2.5
    storm.useMeltEffect = true

    if (snowMode === 'header') {
      var hero = document.querySelector('.js-hero.with-picture')
      if (hero) {
        storm.targetElement = hero
        storm.zIndex = 2
      } else {
        // Pages without a picture hero get no snow in "Header only" mode
        storm.disabled = true
      }
    }

    if (!visitorWantsSnow()) {
      storm.disabled = true
    }
  }

  function snowIsFalling() {
    return !!(storm && !storm.disabled && storm.active)
  }

  function setSnow(on) {
    if (!storm) return
    if (on) {
      storm.disabled = false
      if (storm.flakes && storm.flakes.length) {
        // Resume after stop(): stop() also removed the scroll and resize handlers, so put them back
        storm.active = true
        storm.events.add(window, 'resize', storm.resizeHandler)
        storm.events.add(window, 'scroll', storm.scrollHandler)
        storm.show()
        storm.timerInit()
      } else {
        storm.start()
      }
    } else if (storm.flakes && storm.flakes.length) {
      storm.active = false
      storm.stop()
      storm.freeze()
    } else {
      storm.disabled = true
    }
  }

  function initSnowToggle() {
    var buttons = document.querySelectorAll('.js-snow-toggle')
    if (!buttons.length) return

    // Snowstorm skips mobile devices and pages it was told to ignore; hide the switch there
    if (!storm || (storm.excludeMobile && /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent))) {
      buttons.forEach(function (b) {
        b.hidden = true
      })
      return
    }

    var on = visitorWantsSnow() && !(snowMode === 'header' && !document.querySelector('.js-hero.with-picture'))

    function render() {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', on ? 'true' : 'false')
        b.classList.toggle('is-off', !on)
      })
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        on = !on
        storageSet(SNOW_STORAGE_KEY, on ? 'on' : 'off')
        setSnow(on)
        render()
      })
    })

    render()
  }

  /* ---------------------------------------------------------------------
   * Christmas countdown
   * Counts "sleeps" (nights) in the visitor's own time zone.
   *   1 Nov – 24 Dec : "X sleeps until Christmas" (Christmas Eve = 1 more sleep)
   *   25 – 26 Dec    : Christmas greeting
   *   27 Dec – 31 Oct: Santa is resting
   * ------------------------------------------------------------------- */
  function countdownSeason(now) {
    var month = now.getMonth() // 0 = January
    var day = now.getDate()
    if (month === 11 && (day === 25 || day === 26)) return 'christmas'
    if ((month === 11 && day >= 27) || month < 10) return 'resting'
    return 'counting'
  }

  function sleepsUntilChristmas(now) {
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    var year = today.getFullYear()
    var christmas = new Date(year, 11, 25)
    if (today > christmas) christmas = new Date(year + 1, 11, 25)
    // Math.round absorbs the hour lost or gained when clocks change
    return Math.round((christmas - today) / 86400000)
  }

  function renderCountdown() {
    var el = document.querySelector('.js-christmas-countdown')
    if (!el) return

    var now = new Date()
    var season = countdownSeason(now)
    var sleeps = sleepsUntilChristmas(now)
    var text
    var emoji = '🎄'

    if (season === 'christmas') {
      text = 'Merry Christmas from the North Pole!'
      emoji = '🎁'
    } else if (season === 'resting') {
      text = "Santa's having a well-earned rest!"
      emoji = '💤'
    } else if (sleeps === 1) {
      text = 'Just 1 more sleep until Christmas!'
    } else {
      text = sleeps + ' sleeps until Christmas'
    }

    el.innerHTML = ''
    var icon = document.createElement('span')
    icon.className = 'np-countdown__icon'
    icon.setAttribute('aria-hidden', 'true')
    icon.textContent = emoji
    var label = document.createElement('span')
    label.textContent = text
    el.appendChild(icon)
    el.appendChild(label)
    el.hidden = false
  }

  /* ---------------------------------------------------------------------
   * Dark mode switch
   * The theme now follows the device setting when there is no saved choice,
   * so make sure the switch reflects the mode actually on screen.
   * ------------------------------------------------------------------- */
  function syncDarkModeSwitch() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    document.querySelectorAll('.js-toggle-darkmode').forEach(function (input) {
      input.checked = isDark
    })
  }

  /* ---------------------------------------------------------------------
   * Candy-cane reading progress bar (posts)
   * Measures how far through the article body the reader is.
   * ------------------------------------------------------------------- */
  function initReadingProgress() {
    var progress = document.querySelector('.js-reading-progress')
    var content = document.querySelector('.js-post-content')
    if (!progress || !content) return

    var ticking = false

    function update() {
      ticking = false
      var rect = content.getBoundingClientRect()
      var total = rect.height - window.innerHeight * 0.6
      var read = -rect.top + window.innerHeight * 0.25
      var value = total > 0 ? Math.min(1, Math.max(0, read / total)) : 1
      progress.style.setProperty('--np-progress', value.toFixed(4))
      progress.classList.toggle('is-reading', value > 0.005)
    }

    function onScroll() {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
  }

  /* ---------------------------------------------------------------------
   * Ghost announcement bar
   * Ghost adds the bar at the very top of the page, above our fixed header.
   * Keep --np-announcement-offset equal to how much of the bar is still on
   * screen, so the header and reading progress bar sit just below it and
   * move back to the top as it scrolls away or is closed.
   * ------------------------------------------------------------------- */
  function initAnnouncementBarOffset() {
    var docStyle = document.documentElement.style
    var bar = null
    var current = -1
    var ticking = false

    function update() {
      ticking = false
      var offset = 0
      if (bar && bar.isConnected) {
        offset = Math.max(0, Math.round(bar.getBoundingClientRect().bottom))
      }
      if (offset !== current) {
        current = offset
        docStyle.setProperty('--np-announcement-offset', offset + 'px')
        document.documentElement.classList.toggle('np-announcement-visible', offset > 0)
      }
    }

    function schedule() {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(update)
      }
    }

    // The bar's height changes when Ghost renders it, when the text wraps and when it is closed
    var sizeWatcher = null
    if ('ResizeObserver' in window) {
      sizeWatcher = new ResizeObserver(schedule)
    } else if ('MutationObserver' in window) {
      sizeWatcher = new MutationObserver(schedule)
    }

    // Ghost's script may add the bar before or after this runs
    function findBar() {
      var found = document.getElementById('announcement-bar-root')
      if (found && found !== bar) {
        bar = found
        if (sizeWatcher && 'ResizeObserver' in window) {
          sizeWatcher.observe(bar)
        } else if (sizeWatcher) {
          sizeWatcher.observe(bar, { childList: true, subtree: true })
        }
      }
      schedule()
    }

    if ('MutationObserver' in window) {
      new MutationObserver(findBar).observe(document.body, { childList: true })
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('load', findBar)
    findBar()
  }

  /* ---------------------------------------------------------------------
   * Share buttons: copy link, and the device's own share sheet where available
   * ------------------------------------------------------------------- */
  function initShare() {
    var status = document.querySelector('.js-share-status')

    function say(message) {
      if (!status) return
      status.textContent = message
      window.clearTimeout(say.timer)
      say.timer = window.setTimeout(function () {
        status.textContent = ''
      }, 3000)
    }

    function fallbackCopy(text) {
      var field = document.createElement('textarea')
      field.value = text
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      var ok = false
      try {
        ok = document.execCommand('copy')
      } catch (e) {}
      document.body.removeChild(field)
      return ok
    }

    document.querySelectorAll('.js-share-copy').forEach(function (button) {
      var label = button.querySelector('.js-share-copy-label')
      var original = label ? label.textContent : ''
      button.addEventListener('click', function () {
        var url = button.getAttribute('data-url')
        var done = function () {
          if (label) label.textContent = 'Link copied!'
          say('Link copied to your clipboard.')
          window.setTimeout(function () {
            if (label) label.textContent = original
          }, 2500)
        }
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(url).then(done, function () {
            if (fallbackCopy(url)) done()
            else say('Sorry, the link could not be copied.')
          })
        } else if (fallbackCopy(url)) {
          done()
        } else {
          say('Sorry, the link could not be copied.')
        }
      })
    })

    if (navigator.share) {
      document.querySelectorAll('.js-share-native').forEach(function (button) {
        var item = button.closest('.np-share__native')
        if (item) item.hidden = false
        button.addEventListener('click', function () {
          navigator.share({
            title: button.getAttribute('data-title'),
            url: button.getAttribute('data-url')
          }).catch(function () {})
        })
      })
    }
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn()
    else document.addEventListener('DOMContentLoaded', fn)
  }

  ready(function () {
    renderCountdown()
    initSnowToggle()
    syncDarkModeSwitch()
    initReadingProgress()
    initAnnouncementBarOffset()
    initShare()
  })

  // Exposed for debugging in the browser console
  window.elflingFestive = {
    sleepsUntilChristmas: sleepsUntilChristmas,
    countdownSeason: countdownSeason,
    snowIsFalling: snowIsFalling
  }
})()
