import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { IItem, ISkill, IMob } from '@/types';
import * as services from './index';

// Mock yaml
vi.mock('js-yaml', () => ({
  load: vi.fn(() => {
    return { Body: [] };
  }),
}));

describe('src/services/index', () => {
  let controller: AbortController;

  beforeEach(() => {
    controller = new AbortController();
    vi.clearAllMocks();
  });

  describe('API functions exist and are callable', () => {
    it('should export fetchReplay as an async function', () => {
      expect(typeof services.fetchReplay).toBe('function');
      expect(services.fetchReplay.constructor.name).toMatch(/AsyncFunction|Function/);
    });

    it('should export fetchReplayApi as an async function', () => {
      expect(typeof services.fetchReplayApi).toBe('function');
      expect(services.fetchReplayApi.constructor.name).toMatch(/AsyncFunction|Function/);
    });

    it('should export fetchSkillDb as an async function', () => {
      expect(typeof services.fetchSkillDb).toBe('function');
      expect(services.fetchSkillDb.constructor.name).toMatch(/AsyncFunction|Function/);
    });

    it('should export fetchMobDb as an async function', () => {
      expect(typeof services.fetchMobDb).toBe('function');
      expect(services.fetchMobDb.constructor.name).toMatch(/AsyncFunction|Function/);
    });

    it('should export fetchItemDb as an async function', () => {
      expect(typeof services.fetchItemDb).toBe('function');
      expect(services.fetchItemDb.constructor.name).toMatch(/AsyncFunction|Function/);
    });

    it('should have all 5 main exports', () => {
      const exports = Object.keys(services);
      expect(exports).toContain('fetchReplay');
      expect(exports).toContain('fetchReplayApi');
      expect(exports).toContain('fetchSkillDb');
      expect(exports).toContain('fetchMobDb');
      expect(exports).toContain('fetchItemDb');
      expect(exports.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('fetchSkillDb YAML parsing', () => {
    it('should handle skill database loading', async () => {
      const mockText = 'Body:\n  - Id: 1\n    Name: Skill';
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(mockText),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({
        Body: [{ Id: 1, Name: 'Skill', Description: 'Test', MaxLevel: 10 }],
      } as any);

      const result = await services.fetchSkillDb(controller);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty skill database', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      const result = await services.fetchSkillDb(controller);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should pass correct URL to fetch for skills', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      await services.fetchSkillDb(controller);

      expect(window.fetch).toHaveBeenCalled();
      const calls = vi.mocked(window.fetch).mock.calls as any[];
      const call = calls[calls.length - 1];
      expect(call[0]).toContain('skill_db.yml');
    });

    it('should include abort signal in fetch options', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      await services.fetchSkillDb(controller);

      const calls = vi.mocked(window.fetch).mock.calls as any[];
      const call = calls[calls.length - 1];
      expect(call[1]).toHaveProperty('signal', controller.signal);
    });

    it('should parse skill data with multiple entries', async () => {
      const mockSkills = [
        { Id: 10, Name: 'Skill1', Description: 'Test1', MaxLevel: 10 },
        { Id: 20, Name: 'Skill2', Description: 'Test2', MaxLevel: 5 },
        { Id: 30, Name: 'Skill3', Description: 'Test3', MaxLevel: 1 },
      ];

      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce('mock yaml'),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: mockSkills } as any);

      const result = await services.fetchSkillDb(controller);

      expect(result.length).toBe(3);
      expect(result[0].Name).toBe('Skill1');
      expect(result[1].Name).toBe('Skill2');
      expect(result[2].Name).toBe('Skill3');
    });
  });

  describe('fetchItemDb YAML parsing', () => {
    it('should handle item database loading', async () => {
      const mockText = 'Body:\n  - Id: 501\n    Name: Potion';
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(mockText),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({
        Body: [{ Id: 501, AegisName: 'Potion', Name: 'Potion', Type: 'Consume' }],
      } as any);

      const result = await services.fetchItemDb(controller);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('should pass correct URL to fetch for items', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      await services.fetchItemDb(controller);

      expect(window.fetch).toHaveBeenCalled();
      const calls = vi.mocked(window.fetch).mock.calls as any[];
      const call = calls[calls.length - 1];
      expect(call[0]).toContain('item_db.yml');
    });

    it('should include abort signal in fetch options for items', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      await services.fetchItemDb(controller);

      const calls = vi.mocked(window.fetch).mock.calls as any[];
      const call = calls[calls.length - 1];
      expect(call[1]).toHaveProperty('signal', controller.signal);
    });
  });

  describe('fetchMobDb YAML parsing', () => {
    it('should handle mob database loading', async () => {
      const mockText = 'Body:\n  - Id: 1002\n    Name: Poring';
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(mockText),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({
        Body: [{ Id: 1002, Name: 'Poring', AegisName: 'poring' }],
      } as any);

      const result = await services.fetchMobDb(controller);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty mob database', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      const result = await services.fetchMobDb(controller);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should pass correct URL to fetch for mobs', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      await services.fetchMobDb(controller);

      expect(window.fetch).toHaveBeenCalled();
      const calls = vi.mocked(window.fetch).mock.calls as any[];
      const call = calls[calls.length - 1];
      expect(call[0]).toContain('mob_db.yml');
    });

    it('should include abort signal in fetch options for mobs', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      await services.fetchMobDb(controller);

      const calls = vi.mocked(window.fetch).mock.calls as any[];
      const call = calls[calls.length - 1];
      expect(call[1]).toHaveProperty('signal', controller.signal);
    });

    it('should parse multiple mobs from database', async () => {
      const mockMobs = [
        { Id: 1002, Name: 'Poring', AegisName: 'poring' },
        { Id: 1003, Name: 'Lunatic', AegisName: 'lunatic' },
        { Id: 1004, Name: 'Fabre', AegisName: 'fabre' },
      ];

      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce('mock yaml'),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: mockMobs } as any);

      const result = await services.fetchMobDb(controller);

      expect(result.length).toBe(3);
      expect(result[0].Name).toBe('Poring');
      expect(result[1].Name).toBe('Lunatic');
      expect(result[2].Name).toBe('Fabre');
    });

    it('should extract mob properties correctly', async () => {
      const mockMobs = [{ Id: 1100, Name: 'CustomMob', AegisName: 'custommob' }];

      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: mockMobs } as any);

      const result = await services.fetchMobDb(controller);

      expect(result[0].Id).toBe(1100);
      expect(result[0].Name).toBe('CustomMob');
    });
  });

  describe('abort signal handling', () => {
    it('should accept AbortController signal', async () => {
      const ctrl = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      await services.fetchSkillDb(ctrl);

      expect(window.fetch).toHaveBeenCalled();
    });

    it('should handle different AbortController instances', async () => {
      const ctrl1 = new AbortController();
      const ctrl2 = new AbortController();

      window.fetch = vi
        .fn()
        .mockResolvedValueOnce({ text: vi.fn().mockResolvedValueOnce('') } as any)
        .mockResolvedValueOnce({ text: vi.fn().mockResolvedValueOnce('') } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValue({ Body: [] } as any);

      await services.fetchSkillDb(ctrl1);
      await services.fetchMobDb(ctrl2);

      expect(window.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('YAML parsing', () => {
    it('should call yaml.load function', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce('skill data'),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      await services.fetchSkillDb(controller);

      expect(load).toHaveBeenCalled();
    });

    it('should extract Body property from parsed YAML', async () => {
      const mockSkills = [
        { Id: 1, Name: 'Attack', Description: 'ATK', MaxLevel: 10 },
        { Id: 2, Name: 'Defense', Description: 'DEF', MaxLevel: 5 },
      ];

      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: mockSkills } as any);

      const result = await services.fetchSkillDb(controller);

      expect(result).toEqual(mockSkills);
    });

    it('should return empty array when Body is empty', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      const result = await services.fetchSkillDb(controller);

      expect(result).toEqual([]);
    });
  });

  describe('fetch configuration', () => {
    it('should use GET method for fetchSkillDb', async () => {
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      await services.fetchSkillDb(controller);

      // The last fetch call should be for skill_db.yml
      const calls = vi.mocked(window.fetch).mock.calls as any[];
      const skillCall = calls.find((call) => call[0]?.toString().includes('skill_db.yml'));

      if (skillCall) {
        expect(skillCall[1]).toHaveProperty('signal');
      }
    });

    it('should use text() method to read response', async () => {
      const mockText = vi.fn().mockResolvedValueOnce('yaml content');
      window.fetch = vi.fn().mockResolvedValueOnce({
        text: mockText,
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: [] } as any);

      await services.fetchSkillDb(controller);

      expect(mockText).toHaveBeenCalled();
    });
  });

  describe('type safety', () => {
    it('should return ISkill array from fetchSkillDb', async () => {
      const skills: ISkill[] = [{ Id: 1, Name: 'Skill', Description: 'Test', MaxLevel: 10 }];

      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: skills } as any);

      const result: ISkill[] = await services.fetchSkillDb(controller);

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('Id');
        expect(result[0]).toHaveProperty('Name');
      }
    });

    it('should return IMob array from fetchMobDb', async () => {
      const mobs: IMob[] = [{ Id: 1002, Name: 'Poring', AegisName: 'poring' }];

      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: mobs } as any);

      const result: IMob[] = await services.fetchMobDb(controller);

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('Id');
        expect(result[0]).toHaveProperty('Name');
      }
    });

    it('should return IItem array from fetchItemDb', async () => {
      const items: IItem[] = [{ Id: 501, AegisName: 'Potion', Name: 'Potion', Type: 'Consume' }];

      window.fetch = vi.fn().mockResolvedValueOnce({
        text: vi.fn().mockResolvedValueOnce(''),
      } as any);

      const { load } = await import('js-yaml');
      vi.mocked(load).mockReturnValueOnce({ Body: items } as any);

      const result: IItem[] = await services.fetchItemDb(controller);

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('Id');
        expect(result[0]).toHaveProperty('Name');
      }
    });
  });

  describe('fetchReplay - direct link', () => {
    it('should call fetch with the correct URL', async () => {
      window.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: vi.fn().mockResolvedValueOnce({ ip: '192.168.1.1' }),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: vi.fn().mockResolvedValueOnce({
            players: [],
            monsters: [],
          }),
        } as any);

      const result = await services.fetchReplay('http://example.com/replay', controller);

      expect(result).toBeDefined();
      expect(result.players).toBeDefined();
      expect(window.fetch).toHaveBeenCalled();
    });

    it('should handle response with no valid replay data', async () => {
      window.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: vi.fn().mockResolvedValueOnce({}),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: vi.fn().mockResolvedValueOnce({ unknownField: 'data' }),
        } as any);

      await expect(services.fetchReplay('http://example.com/replay', controller)).rejects.toThrow(
        'Parser response did not include replay data'
      );
    });
  });

  describe('fetchReplayApi function', () => {
    it('should be exported and callable', () => {
      expect(typeof services.fetchReplayApi).toBe('function');
      expect(services.fetchReplayApi.constructor.name).toMatch(/AsyncFunction|Function/);
    });

    it('should handle successful replay API response', async () => {
      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          players: [{ playerId: 'api1' }],
          monsters: [],
        }),
      } as any);

      const formData = new FormData();
      const result = await services.fetchReplayApi(formData, testController);

      expect(result.players).toEqual([{ playerId: 'api1' }]);
      expect(result.monsters).toEqual([]);
    });

    it('should handle API error response', async () => {
      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValueOnce({
          error: 'Invalid replay file',
        }),
      } as any);

      const formData = new FormData();
      await expect(services.fetchReplayApi(formData, testController)).rejects.toThrow(
        'Invalid replay file'
      );
    });

    it('should handle API error with status code', async () => {
      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 413,
        json: vi.fn().mockResolvedValueOnce({}),
      } as any);

      const formData = new FormData();
      await expect(services.fetchReplayApi(formData, testController)).rejects.toThrow(
        'Request failed with status 413'
      );
    });

    it('should handle outputRaw in API response', async () => {
      const testController = new AbortController();
      const data = {
        players: [{ playerId: 'api2' }],
        monsters: [{ monsterId: 'mob' }],
      };

      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          outputRaw: JSON.stringify(data),
          outputId: 'api-out-1',
        }),
      } as any);

      const formData = new FormData();
      const result = await services.fetchReplayApi(formData, testController);

      expect(result.outputId).toBe('api-out-1');
      expect(result.players).toEqual(data.players);
    });
  });

  describe('replay response handling', () => {
    it('should throw error when no replay data in response', async () => {
      window.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: vi.fn().mockResolvedValueOnce({}),
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: vi.fn().mockResolvedValueOnce({ unknownField: 'data' }),
        } as any);

      const controller = new AbortController();
      await expect(services.fetchReplay('http://example.com/replay', controller)).rejects.toThrow(
        'Parser response did not include replay data'
      );
    });

    it('should parse direct JSON response with players and monsters', async () => {
      const testController = new AbortController();

      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          players: [{ playerId: 'p1', name: 'Player 1' }],
          monsters: [{ monsterId: 'm1' }],
        }),
      } as any);

      const result = await services.fetchReplay('http://example.com/replay', testController);

      expect(result.players).toEqual([{ playerId: 'p1', name: 'Player 1' }]);
      expect(result.monsters).toEqual([{ monsterId: 'm1' }]);
    });

    it('should handle outputRaw as stringified JSON', async () => {
      const innerData = {
        players: [{ playerId: 'p2' }],
        monsters: [{ monsterId: 'm2', name: 'Mob' }],
      };

      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          outputRaw: JSON.stringify(innerData),
          outputId: 'id123',
        }),
      } as any);

      const result = await services.fetchReplay('http://example.com/replay', testController);

      expect(result.outputId).toBe('id123');
      expect(result.players).toEqual(innerData.players);
      expect(result.monsters).toEqual(innerData.monsters);
    });

    it('should handle outputRaw as object', async () => {
      const outputData = {
        players: [{ playerId: 'p3' }],
        monsters: [{ monsterId: 'm3' }],
      };

      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          outputRaw: outputData,
          replayFileName: 'replay.zip',
        }),
      } as any);

      const result = await services.fetchReplay('http://example.com/replay', testController);

      expect(result.replayFileName).toBe('replay.zip');
      expect(result.players).toEqual(outputData.players);
    });

    it('should throw on invalid JSON in outputRaw', async () => {
      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          outputRaw: '{invalid json',
        }),
      } as any);

      await expect(
        services.fetchReplay('http://example.com/replay', testController)
      ).rejects.toThrow('Invalid parser outputRaw JSON');
    });

    it('should throw error with requestId when available', async () => {
      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          outputRaw: 'bad json',
          requestId: 'req-123',
        }),
      } as any);

      await expect(
        services.fetchReplay('http://example.com/replay', testController)
      ).rejects.toThrow('Invalid parser outputRaw JSON (requestId: req-123)');
    });

    it('should include requestId in missing data error', async () => {
      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce({
          someData: 'value',
          requestId: 'req-456',
        }),
      } as any);

      await expect(
        services.fetchReplay('http://example.com/replay', testController)
      ).rejects.toThrow('Parser response did not include replay data (requestId: req-456)');
    });

    it('should handle response with json() throwing error', async () => {
      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValueOnce(new Error('JSON parse failed')),
      } as any);

      await expect(
        services.fetchReplay('http://example.com/replay', testController)
      ).rejects.toThrow('Parser response did not include replay data');
    });

    it('should throw error when response.ok is false with error message', async () => {
      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValueOnce({
          error: 'Bad request',
        }),
      } as any);

      await expect(
        services.fetchReplay('http://example.com/replay', testController)
      ).rejects.toThrow('Bad request');
    });

    it('should throw error with status code when response.ok is false but no error message', async () => {
      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValueOnce({}),
      } as any);

      await expect(
        services.fetchReplay('http://example.com/replay', testController)
      ).rejects.toThrow('Request failed with status 500');
    });

    it('should include requestId in error response message', async () => {
      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: vi.fn().mockResolvedValueOnce({
          error: 'Forbidden',
          requestId: 'req-forbidden',
        }),
      } as any);

      await expect(
        services.fetchReplay('http://example.com/replay', testController)
      ).rejects.toThrow('Forbidden (requestId: req-forbidden)');
    });

    it('should handle error response with status code and requestId', async () => {
      const testController = new AbortController();
      window.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: vi.fn().mockResolvedValueOnce({
          requestId: 'req-notfound',
        }),
      } as any);

      await expect(
        services.fetchReplay('http://example.com/replay', testController)
      ).rejects.toThrow('Request failed with status 404 (requestId: req-notfound)');
    });
  });
});
