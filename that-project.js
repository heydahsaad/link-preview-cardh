/**
 * Copyright 2025 heydahsaad
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `that-project`
 * 
 * @demo index.html
 * @element that-project
 */
export class ThatProject extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "that-project";
  }

  constructor() {
    super();
    this.title = "";
    this.webLink = "";    
    this.imageLink = "";
    this.value = null;
    this.loading = false;

    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      webLink: { type: String, attribute: "web-link" },
      description: { type: String },
      imageLink: { type: String, attribute: "image-link" },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--that-project-label-font-size, var(--ddd-font-size-s));
      }
      img {
          display: block;
          max-width: 400px;
          max-height: 400px;
          height: auto;
          margin: var(--ddd-spacing-2);
        }
    `];
  }


  updated(changedProperties) {
    if (changedProperties.has("webLink")) {
      this.updateResults();
    }
  }

updateResults(value) {
  this.loading = true;
  fetch(
    `https://corsproxy.io/?url=https://open-apis.hax.cloud/api/services/website/metadata?q=${this.webLink}`
  )
    .then((d) => (d.ok ? d.json() : {}))
    .then((response) => {
      if (response.data["og:title"]) {
        this.title = response.data["og:title"];
      }
      if (response.data["og:description"]) {
        this.description = response.data["og:description"];
      }
      if (response.data["description"]) {
        this.description = response.data["description"];
      }
      if (response.data["og:image"]) {
        this.imageLink = response.data["og:image"];
      } else if (response.data["ld+json"].logo) {
        this.imageLink = response.data["ld+json"].logo;
      } else if (response.data["og:title"]) {
        this.imageLink = response.data["ld+json"]["publisher"].logo;
      }
    });
}

render() {
  return html`
    <div class="wrapper">
      <h2>${this.title}</h2>
      <!-- <p><a href="${this.webLink}" target="_blank">${this.webLink}</a></p> -->
      <p>${this.description}</p>
      <img
        src="${this.imageLink}"
        alt="${this.t.title}: ${this.title}"
        loading="lazy"
        width="100%"
      />
      <slot></slot>
    </div>
  <!-- <details open></details> -->
  `;
}


  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(ThatProject.tag, ThatProject);