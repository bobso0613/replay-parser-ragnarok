const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-950/60 px-4 py-2 text-slate-300/70">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-left"></div>
        <div className="text-right">
          Frontend by:{' '}
          <a
            href="https://discord.com/users/92073343238279168"
            target="_blank"
            rel="noreferrer"
            className="text-sky-300/70 underline decoration-sky-400/60 underline-offset-4 hover:text-sky-200"
          >
            bobito
          </a>{' '}
          | Parser enhanced by:{' '}
          <a
            href="https://discord.com/users/413714760647966722"
            target="_blank"
            rel="noreferrer"
            className="text-sky-300/70 underline decoration-sky-400/60 underline-offset-4 hover:text-sky-200"
          >
            padder
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
