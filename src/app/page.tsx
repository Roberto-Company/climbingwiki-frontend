export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-24 sm:px-16 sm:py-32">
        <div className="max-w-2xl">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-ochre-600">
            Field guide &amp; logbook
          </p>
          <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] text-foreground sm:text-7xl">
            ClimbingWiki
          </h1>
          <div className="mt-6 h-1 w-16 bg-moss-600" />
          <p className="mt-6 max-w-md font-sans text-lg leading-7 text-stone">
            Zones, crags, sectors, and routes — documented by the people who climb them.
          </p>
          <p className="mt-12 font-sans text-sm text-stone">
            Scaffolding in progress. Catalog browsing and auth land in upcoming phases.
          </p>
        </div>
      </div>
    </main>
  );
}
