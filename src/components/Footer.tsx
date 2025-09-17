export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="container-lg py-10 text-sm text-gray-600 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p>© {year} DevCodeHub — Learn, Build, Share.</p>
        <p>Educational clone inspired by FCC. Not affiliated.</p>
      </div>
    </footer>
  );
}
