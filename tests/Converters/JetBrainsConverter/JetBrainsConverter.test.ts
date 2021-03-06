import { JetBrainsConverter } from '../../../src/Connectors/Converters/JetbrainsConverter/JetBrainsConverter';
import { UniversalKeymap } from '../../../src/Connectors/Keymap';
import {
  HoldableKeys,
  Shortcut,
  SingleShortcut,
} from '../../../src/Connectors/Shortcut';
import { fsUtils } from '../../../src/Connectors/Utils';
import * as path from 'path';
import { APP_NAME } from '../../../src/Connectors/Constants/general';
import * as JB from '../../../src/Connectors/Constants/JetBrains';
import {
  JbKeymapOptions,
  JbXmlConfig,
} from '../../../src/Connectors/Converters/JetbrainsConverter/JetBrains.models';
import { SchemaTypes } from "../../../src/Connectors/Schema/SchemaTypes";


describe('JetBrains converter test', function () {
  const universalKm: UniversalKeymap = new UniversalKeymap({
    formatDocument: [
      new Shortcut(
        new SingleShortcut(
          new Set<HoldableKeys>(['alt', 'shift']),
          'f'
        ),

        new SingleShortcut(
          new Set<HoldableKeys>(['ctrl']),
          'a'
        )
      ),
    ],
  });

  const mockKeymapFolder = './tests/Converters/JetBrainsConverter/mocks';
  const keymapOptionPath = path.join(mockKeymapFolder, 'keymap.xml');
  const keymapOptionSchemaTestPath = path.join(
    mockKeymapFolder,
    'keymapSchemaTest.xml'
  );
  const mockKeymap = path.join(mockKeymapFolder, 'TestKeymap.xml');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Read config', async function () {
    const expectedKm = SchemaTypes.VISUAL_STUDIO.get();
    expectedKm.overrideKeymap(universalKm);

    const converter = new JetBrainsConverter(
      keymapOptionPath,
      mockKeymapFolder
    );

    const converted: UniversalKeymap = await converter.load();
    expect(converted).toEqual(expectedKm);
  });

  it('Write config', async function () {
    const converter = new JetBrainsConverter(
      keymapOptionPath,
      mockKeymapFolder
    );

    const expectedPath =
      path.join(mockKeymapFolder, APP_NAME) + `.${JB.CONFIG_EXTENTION}`;

    const expectedKeymap = await fsUtils.readXml<JbXmlConfig>(mockKeymap);
    const expectedOptions = await fsUtils.readXml<JbKeymapOptions>(
      keymapOptionPath
    );
    expectedOptions.application.component[0].active_keymap[0].$.name = APP_NAME;

    fsUtils.saveXml = jest.fn().mockReturnValue(Promise.resolve());
    await converter.save(universalKm);

    expect(fsUtils.saveXml).toHaveBeenCalledWith(
      keymapOptionPath,
      expectedOptions
    );
    expect(fsUtils.saveXml).toHaveBeenCalledWith(expectedPath, expectedKeymap);
  });

  it('Read config Schema', async function () {
    const expectedKm = SchemaTypes.SUBLIME.get();

    const converter = new JetBrainsConverter(
      keymapOptionSchemaTestPath,
      mockKeymapFolder
    );

    const converted: UniversalKeymap = await converter.load();
    expect(converted).toEqual(expectedKm);
  });
});
