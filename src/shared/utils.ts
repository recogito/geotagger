import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import { Plugin } from '@recogito/studio-sdk';

export const formatId = (id: string, plugin: Plugin) => {

  const format = Object.entries(plugin.options.formats)
    .find(([key, ]) => id.includes(key));

  if (!format)
    return id;

  const { shortcode, uri_pattern } = format[1] as { shortcode: string, uri_pattern: string };

  if (!shortcode || !uri_pattern)
    return id;

  const markerIdx = uri_pattern.indexOf('{{id}}');
  if (markerIdx === -1) return id;

  const prefix = uri_pattern.substring(0, markerIdx);
  const suffix = uri_pattern.substring(markerIdx + '{{id}}'.length);

  if (id.startsWith(prefix) && id.endsWith(suffix)) {
    const startIdx = prefix.length;
    const endIdx = id.length - suffix.length;
    return shortcode 
      ? `${shortcode}:${id.substring(startIdx, endIdx)}`
      : id.substring(startIdx, endIdx);     
  }

}

export const createPopup = (component: ReactNode) => {
  const container = document.createElement('div');

  createRoot(container).render(component);

  return L.popup({ content: container, closeButton: false });
}