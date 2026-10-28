import type { SphereId } from '../../domain/activity';
import SphereGem from './SphereGem';

export default function RelicArt({ sphere, illuminated = false }: { sphere: SphereId; illuminated?: boolean }) {
  return <SphereGem sphere={sphere} illuminated={illuminated} className="relic-art" />;
}
