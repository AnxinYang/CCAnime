import { read } from './utils';
import cc from './cc';
import * as d3 from 'd3';

declare module "d3-selection" {
  export interface Selection<
    GElement extends BaseType,
    Datum,
    PElement extends BaseType,
    PDatum
    > {
    bind(evenName: string, handler: (data: any) => boolean): any
    removed: boolean
    parent(): any
  }
}

d3.selection.prototype.isRemoved = function () {
  this.removed = false;
}

d3.selection.prototype.bind = function (evenName: string, handler: (data: any) => boolean) {
  let self = this;
  handler.call(self, cc.get(evenName)) !== false && cc.handle(evenName, function (...args) {
    evenName;
    return !self.removed && handler.call(self, ...args);
  })
  return this;
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}
d3.selection.prototype.remove = function () {
  this.each(remove);
  this.removed = true;
}

d3.selection.prototype.parent = function () {
  let self = this
  return this.select(function () { return this.parentNode });
}
export default d3;
