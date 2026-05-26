/* D3 choropleth map of Swiss municipalities */

const TOPO_URL = 'https://cdn.jsdelivr.net/npm/swiss-maps@4/2021/ch-combined.json';

function taxColor(pct, min, max) {
  const t = max === min ? 0.5 : (pct - min) / (max - min);
  const low = [26, 122, 74];
  const mid = [245, 230, 200];
  const high = [181, 39, 30];
  let r, g, b;
  if (t < 0.5) {
    const u = t * 2;
    r = low[0] + (mid[0] - low[0]) * u;
    g = low[1] + (mid[1] - low[1]) * u;
    b = low[2] + (mid[2] - low[2]) * u;
  } else {
    const u = (t - 0.5) * 2;
    r = mid[0] + (high[0] - mid[0]) * u;
    g = mid[1] + (high[1] - mid[1]) * u;
    b = mid[2] + (high[2] - mid[2]) * u;
  }
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

class SwissTaxMap {
  constructor(containerId, taxIndex, onSelect) {
    this.container = document.getElementById(containerId);
    this.taxIndex = taxIndex;
    this.onSelect = onSelect;
    this.selectedSfo = null;
    this.stats = null;
    this.projection = null;
    this.path = null;
    this.svg = null;
    this.g = null;
    this.zoom = null;
    this.tooltip = null;
  }

  async init() {
    const [topo] = await Promise.all([
      fetch(TOPO_URL).then((r) => r.json()),
    ]);

    const municipalities = topojson.feature(topo, topo.objects.municipalities);
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 500;

    this.projection = d3.geoIdentity().reflectY(true);
    this.path = d3.geoPath().projection(this.projection);
    this.projection.fitSize([width, height], municipalities);

    this.svg = d3.select(this.container).append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    this.g = this.svg.append('g');

    this.zoom = d3.zoom()
      .scaleExtent([1, 12])
      .on('zoom', (ev) => this.g.attr('transform', ev.transform));

    this.svg.call(this.zoom);

    const pcts = TAX_DATA.map((r) => r.total_pct);
    this.stats = {
      min: Math.min(...pcts),
      max: Math.max(...pcts),
    };

    const self = this;
    this.g.selectAll('path')
      .data(municipalities.features)
      .join('path')
      .attr('class', 'muni-path')
      .attr('d', this.path)
      .attr('data-sfo', (d) => d.id)
      .attr('fill', (d) => {
        const row = self.taxIndex.bySfo.get(d.id);
        return row ? taxColor(row.total_pct, self.stats.min, self.stats.max) : '#ddd';
      })
      .on('mouseenter', function (ev, d) {
        self.showTooltip(ev, d);
      })
      .on('mousemove', (ev) => self.moveTooltip(ev))
      .on('mouseleave', () => self.hideTooltip())
      .on('click', (ev, d) => {
        ev.stopPropagation();
        const row = self.taxIndex.bySfo.get(d.id);
        if (row && self.onSelect) self.onSelect(row, 'map');
      });

    this.tooltip = document.querySelector('.map-tooltip');
    if (!this.tooltip) {
      this.tooltip = document.createElement('div');
      this.tooltip.className = 'map-tooltip';
      this.container.appendChild(this.tooltip);
    }

    window.addEventListener('resize', () => this.resize(municipalities));
    this.municipalities = municipalities;
  }

  resize(municipalities) {
    const m = municipalities || this.municipalities;
    if (!m || !this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.projection.fitSize([width, height], m);
    this.svg.attr('viewBox', `0 0 ${width} ${height}`);
    this.g.selectAll('path').attr('d', this.path);
  }

  showTooltip(ev, d) {
    const row = this.taxIndex.bySfo.get(d.id);
    if (!row || !this.tooltip) return;
    this.tooltip.innerHTML = `<strong>${row.commune}</strong> (${row.canton})<br>${row.total_pct.toFixed(2)}% · CHF ${row.total_chf.toLocaleString('de-CH')}`;
    this.tooltip.classList.add('visible');
    this.moveTooltip(ev);
  }

  moveTooltip(ev) {
    if (!this.tooltip) return;
    const rect = this.container.getBoundingClientRect();
    this.tooltip.style.left = `${ev.clientX - rect.left + 12}px`;
    this.tooltip.style.top = `${ev.clientY - rect.top + 12}px`;
  }

  hideTooltip() {
    this.tooltip?.classList.remove('visible');
  }

  highlightSfo(sfoId) {
    this.selectedSfo = sfoId;
    this.g?.selectAll('.muni-path')
      .classed('selected', (d) => d.id === sfoId);
    if (sfoId && this.g) {
      const feat = this.g.selectAll('path').data().find((d) => d.id === sfoId);
      if (feat && this.path && this.zoom) {
        const bounds = this.path.bounds(feat);
        const [[x0, y0], [x1, y1]] = bounds;
        const dx = x1 - x0;
        const dy = y1 - y0;
        const cx = (x0 + x1) / 2;
        const cy = (y0 + y1) / 2;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const scale = Math.min(8, 0.85 / Math.max(dx / width, dy / height));
        const transform = d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scale)
          .translate(-cx, -cy);
        this.svg.transition().duration(600).call(this.zoom.transform, transform);
      }
    }
  }
}

window.SwissTaxMap = SwissTaxMap;
