import type { SupabaseAnnotation } from '@recogito/annotorious-supabase';
import { useAnnotations } from '@annotorious/react';
import type { PluginInstallationConfig } from '@components/Plugins';
import { useLeaflet } from '../../useLeaflet';

import './DocumentMap.css';

interface DocumentMapProps {

  plugin: PluginInstallationConfig;

}

export const DocumentMap = (props: DocumentMapProps) => {

  const annotations = useAnnotations<SupabaseAnnotation>();

  const { basemap} = props.plugin.meta.options;

  const { ref, map } = useLeaflet({ basemap, initialCenter: [0, 0], initialZoom: 2 });

  return (
    <div ref={ref} className="ou-gtp-document-map">
    </div>
  )

}