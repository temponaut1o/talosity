import type { Company, Robot } from '@/lib/types';

interface RobotCardProps {
  robot: Robot;
  company?: Company;
}

export function RobotCard({ robot, company }: RobotCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Robot platform</p>
          <h3 className="mt-1 text-xl font-semibold">{robot.name}</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
          {robot.application}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{robot.description}</p>

      <dl className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
        <div>
          <dt className="text-slate-400">Deployment</dt>
          <dd className="mt-1 font-medium text-white">{robot.deployment}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Payload</dt>
          <dd className="mt-1 font-medium text-white">{robot.payload}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Autonomy</dt>
          <dd className="mt-1 font-medium text-white">{robot.autonomy}</dd>
        </div>
      </dl>

      {company ? (
        <p className="mt-5 text-sm text-slate-400">Built by {company.name}</p>
      ) : null}
    </article>
  );
}
