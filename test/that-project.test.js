import { html, fixture, expect } from '@open-wc/testing';
import "../that-project.js";

describe("ThatProject test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <that-project
        title="title"
      ></that-project>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
