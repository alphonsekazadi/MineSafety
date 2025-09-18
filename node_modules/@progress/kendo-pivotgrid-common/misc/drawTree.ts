export const drawTree = (data) => {
    const Node = (v, xs) => ({
        type: 'Node',
        caption: v,
        children: xs || []
    });
 
    const Tuple = (a, b) => ({
        type: 'Tuple',
        '0': a,
        '1': b,
        length: 2
    });
 
    const Tuple3 = (a, b, c) => ({
        type: 'Tuple3',
        '0': a,
        '1': b,
        '2': c,
        length: 3
    });
 
    const compose = (f, g) => x => f(g(x));
 
    const concat = xs =>
        0 < xs.length ? (() => {
            const unit = 'string' !== typeof xs[0] ? (
                []
            ) : '';
            return unit.concat.apply(unit, xs);
        })() : [];
 
    const fmapTree = (f, tree) => {
        const go = node => Node(
            f(node.caption),
            node.children.map(go)
        );
        return go(tree);
    };
 
    const fst = tpl => tpl[0];
 
    const init = xs =>
        0 < xs.length ? (
            xs.slice(0, -1)
        ) : undefined;
 
    const intercalate = (sep, xs) =>
        0 < xs.length && 'string' === typeof sep &&
        'string' === typeof xs[0] ? (
            xs.join(sep)
        ) : concat(intersperse(sep, xs));
 
    const intersperse = (sep, xs) => {
        const bln = 'string' === typeof xs;
        return xs.length > 1 ? (
            (bln ? concat : x => x)(
                (bln ? (
                    xs.split('')
                ) : xs)
                .slice(1)
                .reduce((a, x) => a.concat([sep, x]), [xs[0]])
            )) : xs;
    };
 
    const iterateUntil = (p, f, x) => {
        const vs = [x];
        let h = x;
        while (!p(h))(h = f(h), vs.push(h));
        return vs;
    };
 
    const levels = tree =>
        iterateUntil(
            xs => 1 > xs.length,
            ys => [].concat(...ys.map(children)),
            [tree]
        ).map(xs => xs.map(caption));
 
    const maximum = xs =>
        0 < xs.length ? (
            xs.slice(1).reduce((a, x) => x > a ? x : a, xs[0])
        ) : undefined;
 
    const children = tree => tree.children;
 
    const caption = tree => tree.caption || 'ROOT';
 
    const splitAt = (n, xs) =>
        Tuple(xs.slice(0, n), xs.slice(n));
 
    const unlines = xs => xs.join('\n');
 
    const drawTree2 = blnCompact => blnPruned => tree => {
        const
            // Lefts, Middle, Rights
            lmrFromStrings = xs => {
                const [ls, rs] = Array.from(splitAt(
                    Math.floor(xs.length / 2),
                    xs
                ));
                return Tuple3(ls, rs[0], rs.slice(1));
            },
            stringsFromLMR = lmr =>
            Array.from(lmr).reduce((a: any, x) => a.concat(x), []),
            fghOverLMR = (f, g, h) => lmr => {
                let ls: any[];
                let m: any;
                let rs: any[];
                [ls, m, rs] = Array.from(lmr);
                return Tuple3(ls.map(f), g(m), rs.map(h));
            };
 
        const lmrBuild = (f, w) => wsTree => {
            let nChars: any;
            let x: any;
            const
                leftPad = n => s => ' '.repeat(n) + s,
                xs = wsTree.children,
                lng = xs.length;
            
            [nChars, x] = Array.from(wsTree.caption);
 
            return 0 === lng ? (
                Tuple3([], '─'.repeat(w - nChars) + x, [])
 
            ) : 1 === lng ? (() => {
                const indented = leftPad(1 + w);
                return fghOverLMR(
                    indented,
                    z => '─'.repeat(w - nChars) + x + '─' + z,
                    indented
                )(f(xs[0]));
 
            })() : (() => {
                const
                    cFix = x => xs => x + xs,
                    treeFix = (l, m, r) => compose(
                        stringsFromLMR,
                        fghOverLMR(cFix(l), cFix(m), cFix(r))
                    ),
                    _x = '─'.repeat(w - nChars) + x,
                    indented = leftPad(w),
                    lmrs = xs.map(f);
                return fghOverLMR(
                    indented,
                    s => _x + ({
                        '┌': '┬',
                        '├': '┼',
                        '│': '┤',
                        '└': '┴'
                    })[s[0]] + s.slice(1),
                    indented
                )(lmrFromStrings(
                    intercalate(
                        blnCompact ? [] : ['│'],
                        [treeFix(' ', '┌', '│')(lmrs[0])]
                        .concat(init(lmrs.slice(1)).map(
                            treeFix('│', '├', '│')
                        ))
                        .concat([treeFix('│', '└', ' ')(
                            lmrs[lmrs.length - 1]
                        )])
                    )
                ));
            })();
        };
        const
            measuredTree = fmapTree(
                v => {
                    const s = ' ' + v + ' ';
                    return Tuple(s.length, s)
                }, tree
            ),
            levelWidths = init(levels(measuredTree))
            .reduce(
                (a, level) => a.concat(maximum(level.map(fst))),
                []
            ),
            treeLines: any = stringsFromLMR(
                levelWidths.reduceRight(
                    lmrBuild, x => x
                )(measuredTree)
            );
        return unlines(
            blnPruned ? (
                treeLines.filter(
                    s => s.split('')
                    .some(c => !' │'.includes(c))
                )
            ) : treeLines
        );
    };

    return drawTree2(true)(true)(data);
}
