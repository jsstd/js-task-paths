'use strict';

const assert = require('assert'),
      vars   = require('../variables'),

      path = require(vars.path),

      TypeException = require(vars.exception.TypeException);

module.exports = {
    'js-task-paths' : {
        'beforeEach' : () => {
            path.reset();
        },

        '.getOptions()' : () => {
            assert.deepStrictEqual(
                path.getOptions(),
                path.DEFAULTS
            );

            assert(path.getOptions('rootName') === path.DEFAULT_ROOT_NAME);
            assert(path.getOptions('append')   === path.DEFAULT_APPEND);
            assert.deepStrictEqual(
                path.getOptions('tokens'),
                path.DEFAULT_TOKENS
            );
        },

        '.setOptions()' : () => {
            // set one option
            path.setOptions({
                rootName : '/www'
            });

            assert(path.getOptions('rootName') === '/www');

            // set multiple options
            path.setOptions({
                rootName : '/home',
                tokens   : [
                    '<', '>'
                ],
            });

            assert(path.getOptions('rootName') === '/home');
            assert.deepStrictEqual(
                path.getOptions('tokens'),
                [
                    '<', '>'
                ]
            );
        },

        'tokens' : {
            'set tokens' : () => {
                path.setOptions({
                    tokens : [
                        '<<', '>>'
                    ]
                });

                assert.deepStrictEqual(
                    path.getOptions('tokens'),
                    [
                        '<<', '>>'
                    ]
                );
            },

            'built-in tokens' : () => {
                const root = path.getRoot();

                assert(path.get('<root>')   === `${root}`);
                assert(path.get('<<root>>') === `${root}`);

                assert(path.get('@root@')   === `${root}`);
                assert(path.get('{@root@}') === `${root}`);

                assert(path.get('{%root%}') === `${root}`);
                assert(path.get('{{root}}') === `${root}`);
            },

            'custom tokens' : () => {
                const root = path.getRoot();

                // one pair
                path.setOptions({
                    tokens : [
                        '[[', ']]',
                    ]
                });

                assert(path.get('[[root]]') === `${root}`);

                assert.deepStrictEqual(
                    path.getOptions('tokens'),
                    [
                        '[[', ']]',
                    ]
                );

                // multiple pairs
                path.setOptions({
                    tokens : [
                        '#',  '#',
                        '[[', ']]',
                        '::', '::',
                    ]
                });

                assert(path.get('#root#')   === `${root}`);
                assert(path.get('[[root]]') === `${root}`);
                assert(path.get('::root::') === `${root}`);

                assert.deepStrictEqual(
                    path.getOptions('tokens'),
                    [
                        '#',  '#',
                        '[[', ']]',
                        '::', '::',
                    ]
                );
            },
        },

        'exceptions' : () => {
            try {
                path.setOptions([]);
            } catch (exception) {
                assert(exception instanceof TypeException);
            }
        },
    }
};
