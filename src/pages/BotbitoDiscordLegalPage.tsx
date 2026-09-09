import { useEffect, useState } from 'react';

type BotbitoDiscordLegalPageProps = {
  title: 'Terms of Service' | 'Privacy Policy';
};

type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
};

type LegalContent = {
  termsOfService: LegalDocument;
  privacyPolicy: LegalDocument;
};

const LEGAL_CONTENT_URL = `${import.meta.env.BASE_URL}botbito-discord-legal.json`;

const DOCUMENT_KEY_BY_TITLE = {
  'Terms of Service': 'termsOfService',
  'Privacy Policy': 'privacyPolicy',
} as const;

/**
 * Renders a full-width Botbito Discord legal document from the editable public JSON asset.
 *
 * @param props - The legal document title that selects the corresponding JSON document.
 * @returns The selected legal document, loading state, or asset-load error state.
 */
export const BotbitoDiscordLegalPage = ({ title }: BotbitoDiscordLegalPageProps) => {
  const [document, setDocument] = useState<LegalDocument>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadDocument = async () => {
      setDocument(undefined);
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch(LEGAL_CONTENT_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Unable to load legal document: ${response.status}`);
        }

        const legalContent = (await response.json()) as LegalContent;
        setDocument(legalContent[DOCUMENT_KEY_BY_TITLE[title]]);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setHasError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadDocument();

    return () => controller.abort();
  }, [title]);

  return (
    <section aria-label={`Botbito Discord ${title}`} className="w-full">
      <h2 className="text-center font-semibold text-slate-100">Botbito Discord</h2>
      <h3 className="text-center text-lg font-semibold text-slate-100">{title}</h3>
      {document && (
        <article className="mt-12 min-h-96 w-full space-y-8 text-slate-300">
          <p className="text-sm text-slate-400">Last updated: {document.lastUpdated}</p>
          <p>{document.intro}</p>
          <div className="space-y-6">
            {document.sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-100">{section.heading}</h3>
                <div className="space-y-3 rounded-md border border-slate-700 p-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      )}
      {isLoading && <p className="mt-12 min-h-96 text-slate-300">Loading document...</p>}
      {hasError && <p className="mt-12 min-h-96 text-red-300">Unable to load this document.</p>}
    </section>
  );
};

export default BotbitoDiscordLegalPage;
