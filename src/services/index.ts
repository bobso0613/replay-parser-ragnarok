import { PARSER_URL } from '@/constants';
import type { IMob, IReplayData, ISkill } from '@/types';
import * as yaml from 'js-yaml';

export const fetchReplay = async (link: string, controller: AbortController) => {
  const result = await fetch(`${link}`, { signal: controller.signal }).then((res) => res.json());

  return result;
};

export const fetchReplayApi = async (
  formData: FormData,
  controller: AbortController
): Promise<IReplayData> => {
  const response = await fetch(`${PARSER_URL}`, {
    method: 'POST',
    body: formData,
    signal: controller.signal,
  });

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const apiError = payload as { error?: string; requestId?: string } | null;
    const errorMessage = apiError?.error ?? `Request failed with status ${response.status}`;
    const requestIdLabel = apiError?.requestId ? ` (requestId: ${apiError.requestId})` : '';

    throw new Error(`${errorMessage}${requestIdLabel}`);
  }

  const result = payload as IReplayData;

  return result;
};

export const fetchSkillDb = async (controller: AbortController) => {
  const skillDbYML = await fetch('/yaml/skill_db.yml', { signal: controller.signal }).then((res) =>
    res.text()
  );
  const skillDb = (yaml.load(skillDbYML) as { Body: ISkill[] }).Body;

  return skillDb;
};

export const fetchMobDb = async (controller: AbortController) => {
  const mobDbYML = await fetch('/yaml/mob_db.yml', { signal: controller.signal }).then((res) =>
    res.text()
  );
  const mobDb = (yaml.load(mobDbYML) as { Body: IMob[] }).Body;

  return mobDb;
};
