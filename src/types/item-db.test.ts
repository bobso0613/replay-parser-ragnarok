import { describe, it, expect } from 'vitest';
import type { IItem } from './item-db';

describe('item-db types', () => {
  it('should define IItem interface', () => {
    const itemExample: IItem = {
      Id: 1101,
      AegisName: 'Sword',
      Name: 'Sword',
      Type: 'Weapon',
      SubType: '1hSword',
      Buy: 100,
      Weight: 500,
      Attack: 25,
      Range: 1,
      Slots: 3,
      Jobs: {
        Swordman: true,
      },
      Locations: {
        Right_Hand: true,
      },
      WeaponLevel: 1,
      EquipLevelMin: 2,
      Refineable: true,
    };

    expect(itemExample.Id).toBe(1101);
    expect(itemExample.AegisName).toBe('Sword');
  });

  it('should accept nested item metadata', () => {
    const itemData: IItem = {
      Id: 501,
      AegisName: 'Potion',
      Name: 'Potion',
      Type: 'Consume',
      Buy: 50,
      Sell: 25,
      Stack: {
        Amount: 10,
        Inventory: true,
      },
      Flags: {
        NoConsume: false,
      },
    };

    expect(itemData.Stack?.Amount).toBe(10);
    expect(itemData.Flags?.NoConsume).toBe(false);
  });
});
