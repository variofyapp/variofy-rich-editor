import { Check, Clipboard, GitFork, PackageOpen } from "lucide-react";
import { useState } from "react";

import { RichTextEditor } from "../src";

const initialContent = `
  <h2>Make writing feel effortless</h2>
  <p>Variofy Rich Editor gives your React app a clean editing experience with a small, extensible API.</p>
  <blockquote>Built with Tiptap, styled with the same composable ideas as shadcn/ui.</blockquote>
  <table><tbody><tr><th><p>Feature</p></th><th><p>Status</p></th></tr><tr><td><p>Table editing</p></td><td><p>Ready</p></td></tr><tr><td><p>Column resizing</p></td><td><p>Ready</p></td></tr></tbody></table>
  <p>Try selecting text, adding a link, or switching this paragraph to a heading.</p>
`;

export function App() {
  const [html, setHtml] = useState(initialContent);
  const [copied, setCopied] = useState(false);

  const copyInstall = async () => {
    await navigator.clipboard.writeText("npm install variofy-rich-editor");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="demo-shell">
      <nav className="demo-nav">
        <a
          className="demo-brand"
          href="#top"
          aria-label="Variofy Rich Editor home"
        >
          <span className="demo-brand__mark">
            <PackageOpen size={18} />
          </span>
          <span>Variofy Rich Editor</span>
        </a>
        <div className="demo-nav__actions">
          <span className="demo-version">v0.1.0</span>
          <a
            className="demo-icon-link"
            href="https://github.com/variofyapp/variofy-rich-editor"
            aria-label="GitHub"
          >
            <GitFork size={18} />
          </a>
        </div>
      </nav>

      <section id="top" className="demo-hero">
        <div className="demo-eyebrow">
          <span /> Tiptap × shadcn/ui
        </div>
        <h1>A rich text editor your product will feel at home with.</h1>
        <p className="demo-lead">
          Accessible, typed, and easy to extend. Bring a polished writing
          experience to any React app without rebuilding the basics.
        </p>
        <button className="demo-install" type="button" onClick={copyInstall}>
          <code>npm install variofy-rich-editor</code>
          {copied ? <Check size={17} /> : <Clipboard size={17} />}
        </button>
      </section>

      <section className="demo-playground" aria-labelledby="playground-title">
        <div className="demo-section-heading">
          <div>
            <span className="demo-kicker">PLAYGROUND</span>
            <h2 id="playground-title">Write something great</h2>
          </div>
          <span className="demo-live">
            <span /> Live output
          </span>
        </div>

        <RichTextEditor
          value={html}
          onChange={setHtml}
          placeholder="Tell your story…"
          minHeight={320}
        />

        <details className="demo-output">
          <summary>View generated HTML</summary>
          <pre>
            <code>{html}</code>
          </pre>
        </details>
      </section>

      <section className="demo-features">
        <article>
          <span>01</span>
          <h3>Headless at heart</h3>
          <p>
            Add Tiptap extensions or replace the toolbar without fighting the
            package.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Beautiful by default</h3>
          <p>
            shadcn-style primitives and themeable CSS variables, with no
            Tailwind requirement.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Ready to ship</h3>
          <p>
            ESM, CommonJS, declarations, controlled mode, SSR-safe rendering,
            and tests.
          </p>
        </article>
      </section>
    </main>
  );
}
