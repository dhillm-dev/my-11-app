// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")

// Custom hooks for LiveView
let Hooks = {}

// Search debouncing hook
Hooks.SearchInput = {
  mounted() {
    this.timeout = null
    this.el.addEventListener("input", e => {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.pushEvent("search", {query: e.target.value})
      }, 300)
    })
  },
  destroyed() {
    clearTimeout(this.timeout)
  }
}

// Auto-refresh hook for real-time data
Hooks.AutoRefresh = {
  mounted() {
    this.interval = setInterval(() => {
      this.pushEvent("refresh", {})
    }, 30000) // Refresh every 30 seconds
  },
  destroyed() {
    clearInterval(this.interval)
  }
}

// File upload progress hook
Hooks.FileUpload = {
  mounted() {
    this.el.addEventListener("change", e => {
      const file = e.target.files[0]
      if (file) {
        this.pushEvent("file_selected", {name: file.name, size: file.size})
      }
    })
  }
}

// Modal management hook
Hooks.Modal = {
  mounted() {
    this.el.addEventListener("click", e => {
      if (e.target === this.el) {
        this.pushEvent("close_modal", {})
      }
    })
    
    // Close modal on escape key
    this.handleKeyDown = (e) => {
      if (e.key === "Escape") {
        this.pushEvent("close_modal", {})
      }
    }
    document.addEventListener("keydown", this.handleKeyDown)
  },
  destroyed() {
    document.removeEventListener("keydown", this.handleKeyDown)
  }
}

// Confirmation dialog hook
Hooks.ConfirmAction = {
  mounted() {
    this.el.addEventListener("click", e => {
      const message = this.el.dataset.confirm
      if (message && !confirm(message)) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    })
  }
}

// Copy to clipboard hook
Hooks.CopyToClipboard = {
  mounted() {
    this.el.addEventListener("click", e => {
      const text = this.el.dataset.clipboard
      navigator.clipboard.writeText(text).then(() => {
        this.pushEvent("copied", {text: text})
      })
    })
  }
}

let liveSocket = new LiveSocket("/live", Socket, {
  longPollFallbackMs: 2500,
  params: {_csrf_token: csrfToken},
  hooks: Hooks
})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

// Custom JavaScript for admin panel functionality
document.addEventListener("DOMContentLoaded", function() {
  // Mobile sidebar toggle
  const sidebarToggle = document.querySelector('[data-sidebar-toggle]')
  const sidebar = document.querySelector('[data-sidebar]')
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('hidden')
    })
  }
  
  // Auto-hide flash messages
  const flashMessages = document.querySelectorAll('[data-flash]')
  flashMessages.forEach(flash => {
    setTimeout(() => {
      flash.style.opacity = '0'
      setTimeout(() => flash.remove(), 300)
    }, 5000)
  })
  
  // Table row selection
  const selectAllCheckbox = document.querySelector('[data-select-all]')
  const rowCheckboxes = document.querySelectorAll('[data-select-row]')
  
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      rowCheckboxes.forEach(checkbox => {
        checkbox.checked = this.checked
      })
    })
  }
  
  // Bulk actions
  const bulkActionForm = document.querySelector('[data-bulk-actions]')
  if (bulkActionForm) {
    bulkActionForm.addEventListener('submit', function(e) {
      const selectedRows = document.querySelectorAll('[data-select-row]:checked')
      if (selectedRows.length === 0) {
        e.preventDefault()
        alert('Please select at least one item.')
      }
    })
  }
})