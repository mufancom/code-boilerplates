import type {ComposeFunction, TextFile} from '@magicspace/core';

export type TextSegment = string | undefined | null | false;

export function concatTextSegment(...segments: TextSegment[]): string {
  return `${segments
    .map(segment => {
      if (typeof segment === 'string') {
        return segment.trim();
      } else {
        return '';
      }
    })
    .filter(segment => !!segment)
    .join('\n\n')}\n`;
}

export function textSegment(
  ...segments: TextSegment[]
): ComposeFunction<TextFile> {
  return content => concatTextSegment(content, ...segments);
}
