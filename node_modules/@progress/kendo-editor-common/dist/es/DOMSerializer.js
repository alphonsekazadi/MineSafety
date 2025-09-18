import { setAttribute } from './utils';
export class DOMSerializer {
    /// Render an [output spec](#model.DOMOutputSpec) to a DOM node. If
    /// the spec has a hole (zero) in it, `contentDOM` will point at the
    /// node with the hole.
    static renderSpec(docum, structure, xmlNS = null) {
        if (typeof structure === 'string') {
            return { dom: docum.createTextNode(structure) };
        }
        if (structure.nodeType != null) {
            return { dom: structure };
        }
        if (structure.dom && structure.dom.nodeType != null) {
            return structure;
        }
        let tagName = structure[0], space = tagName.indexOf(' ');
        if (space > 0) {
            xmlNS = tagName.slice(0, space);
            tagName = tagName.slice(space + 1);
        }
        let contentDOM;
        const dom = (xmlNS ? docum.createElementNS(xmlNS, tagName) : docum.createElement(tagName));
        const attrs = structure[1];
        let start = 1;
        if (attrs && typeof attrs === 'object' && attrs.nodeType == null && !Array.isArray(attrs)) {
            start = 2;
            for (const name in attrs) {
                if (attrs[name] != null) {
                    space = name.indexOf(' ');
                    if (space > 0) {
                        dom.setAttributeNS(name.slice(0, space), name.slice(space + 1), attrs[name]);
                    }
                    else {
                        setAttribute(dom, name, attrs[name]);
                    }
                }
            }
        }
        for (let i = start; i < structure.length; i++) {
            const child = structure[i];
            if (child === 0) {
                if (i < structure.length - 1 || i > start) {
                    throw new RangeError('Content hole must be the only child of its parent node');
                }
                return { dom, contentDOM: dom };
            }
            else {
                const { dom: inner, contentDOM: innerContent } = DOMSerializer.renderSpec(docum, child, xmlNS);
                dom.appendChild(inner);
                if (innerContent) {
                    if (contentDOM) {
                        throw new RangeError('Multiple content holes');
                    }
                    contentDOM = innerContent;
                }
            }
        }
        return { dom, contentDOM };
    }
    /// Build a serializer using the [`toDOM`](#model.NodeSpec.toDOM)
    /// properties in a schema's node and mark specs.
    static fromSchema(schema) {
        return schema.cached.domSerializer ||
            (schema.cached.domSerializer = new DOMSerializer(this.nodesFromSchema(schema), this.marksFromSchema(schema)));
    }
    /// Gather the serializers in a schema's node specs into an object.
    /// This can be useful as a base to build a custom serializer from.
    static nodesFromSchema(schema) {
        const result = gatherToDOM(schema.nodes);
        if (!result.text) {
            result.text = node => node.text;
        }
        return result;
    }
    /// Gather the serializers in a schema's mark specs into an object.
    static marksFromSchema(schema) {
        return gatherToDOM(schema.marks);
    }
    /// Create a serializer. `nodes` should map node names to functions
    /// that take a node and return a description of the corresponding
    /// DOM. `marks` does the same for mark names, but also gets an
    /// argument that tells it whether the mark's content is block or
    /// inline content (for typical use, it'll always be inline). A mark
    /// serializer may be `null` to indicate that marks of that type
    /// should not be serialized.
    constructor(
    /// The node serialization functions.
    nodes, 
    /// The mark serialization functions.
    marks) {
        this.nodes = nodes;
        this.marks = marks;
    }
    /// Serialize the content of this fragment to a DOM fragment. When
    /// not in the browser, the `document` option, containing a DOM
    /// document, should be passed so that the serializer can create
    /// nodes.
    serializeFragment(fragment, options = {}, target) {
        if (!target) {
            target = doc(options).createDocumentFragment();
        }
        let top = target;
        const active = [];
        fragment.forEach(node => {
            if (active.length || node.marks.length) {
                let keep = 0, rendered = 0;
                while (keep < active.length && rendered < node.marks.length) {
                    const next = node.marks[rendered];
                    if (!this.marks[next.type.name]) {
                        rendered++;
                        continue;
                    }
                    if (!next.eq(active[keep][0]) || next.type.spec.spanning === false) {
                        break;
                    }
                    keep++;
                    rendered++;
                }
                while (keep < active.length) {
                    top = active.pop()[1];
                }
                while (rendered < node.marks.length) {
                    const add = node.marks[rendered++];
                    const markDOM = this.serializeMark(add, node.isInline, options);
                    if (markDOM) {
                        active.push([add, top]);
                        top.appendChild(markDOM.dom);
                        top = markDOM.contentDOM || markDOM.dom;
                    }
                }
            }
            top.appendChild(this.serializeNodeInner(node, options));
        });
        return target;
    }
    /// Serialize this node to a DOM node. This can be useful when you
    /// need to serialize a part of a document, as opposed to the whole
    /// document. To serialize a whole document, use
    /// [`serializeFragment`](#model.DOMSerializer.serializeFragment) on
    /// its [content](#model.Node.content).
    serializeNode(node, options = {}) {
        let dom = this.serializeNodeInner(node, options);
        for (let i = node.marks.length - 1; i >= 0; i--) {
            const wrap = this.serializeMark(node.marks[i], node.isInline, options);
            if (wrap) {
                (wrap.contentDOM || wrap.dom).appendChild(dom);
                dom = wrap.dom;
            }
        }
        return dom;
    }
    /// @internal
    serializeMark(mark, inline, options = {}) {
        const toDOM = this.marks[mark.type.name];
        return toDOM && DOMSerializer.renderSpec(doc(options), toDOM(mark, inline));
    }
    /// @internal
    serializeNodeInner(node, options) {
        const { dom, contentDOM } = DOMSerializer.renderSpec(doc(options), this.nodes[node.type.name](node));
        if (contentDOM) {
            if (node.isLeaf) {
                throw new RangeError('Content hole not allowed in a leaf node spec');
            }
            this.serializeFragment(node.content, options, contentDOM);
        }
        return dom;
    }
}
function gatherToDOM(obj) {
    const result = {};
    for (const name in obj) {
        if (obj[name]) {
            const toDOM = obj[name].spec.toDOM;
            if (toDOM) {
                result[name] = toDOM;
            }
        }
    }
    return result;
}
function doc(options) {
    return options.document || window.document;
}
