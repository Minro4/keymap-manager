import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, { ReactElement } from 'react'; // we need this to make JSX compile
import { UniversalKeymap } from '../../Connectors/Keymap';
import { Shortcut } from '../../Connectors/Shortcut';
import {
  IShortcutDefinition,
  ShortcutDefinitions,
} from '../../Connectors/ShortcutDefinitions';
import { ShortcutElement } from './shortcut';

type KeymapTableProps = {
  keymap: UniversalKeymap;
  shortcutDefinitions: ShortcutDefinitions;
  onClick: (definition: IShortcutDefinition) => void;
};

export const KeymapTable = ({
  keymap,
  shortcutDefinitions,
  onClick,
}: KeymapTableProps): ReactElement => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow className="keymapper-row">
          <TableCell className="command-col">Command</TableCell>
          <TableCell className="keybindings-col">Keybindings</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {shortcutDefinitions.definitions.map((definition, index) => {
          return (
            <TableRow
              key={index}
              onClick={() => onClick(definition)}
              className="keymapper-row"
            >
              <TableCell className="command-col">{definition.label}</TableCell>
              <TableCell className="keybindings-col">
                <ShortcutsList
                  shortcuts={keymap.get(definition.id)}
                ></ShortcutsList>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

type ShortcutsListProps = {
  shortcuts: Shortcut[];
};

const ShortcutsList = ({ shortcuts }: ShortcutsListProps): ReactElement => (
  <>
    {shortcuts.map((shortcut, idx) => (
      <Box component="span" key={idx}>
        <ShortcutElement shortcut={shortcut}></ShortcutElement>{' '}
        {idx != shortcuts.length - 1 && ' or '}
      </Box>
    ))}
  </>
);