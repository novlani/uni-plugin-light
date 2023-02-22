import path from 'path';
import preprocessLoader from '../../../loader/ifdef-loader';

jest.mock('loader-utils', () => ({
  getOptions: jest.fn()
    .mockReturnValueOnce({
      type: ['js'],
      num: 1,
      context: { H5: true },
    })
    .mockReturnValueOnce({
      context: { H5: true },
      num: 2,
    })
    .mockReturnValueOnce({
      type: ['js'],
      context: { 'MP-WEIXIN': true },
      num: 3,
    })
    .mockReturnValueOnce({
      type: ['html'],
      context: { H5: true },
      num: 4,
    })
    .mockReturnValueOnce({
      type: ['html'],
      context: { 'MP-WEIXIN': true },
      num: 5,
    })
    .mockReturnValueOnce({
      type: ['js'],
      context: { 'MP-WEIXIN': true },
      num: 6,
    })
    .mockReturnValueOnce({
      type: ['css'],
      context: { H5: true },
      num: 7,
    })
    .mockReturnValueOnce({
      type: ['css'],
      context: { 'MP-WEIXIN': true },
      num: 8,
    })
    .mockReturnValueOnce({
      type: ['html'],
      context: { H5: true },
      num: 9,
    })
    .mockReturnValueOnce({
      type: ['html', 'css', 'js'],
      context: { H5: true },
      num: 10,
    })
    .mockReturnValueOnce({
      type: ['html', 'css', 'js'],
      context: { 'MP-WEIXIN': true },
      num: 11,
    })
    .mockReturnValue({
      type: ['js'],
      context: { 'MP-WEIXIN': true },
    }),
}));


const jsStr = `
// #ifdef H5
console.log('1');
// #endif

// #ifndef H5
console.log('2');
// #endif

console.log('3');
`;


const htmlStr = `
<!-- #ifdef H5 -->
console.log('a');
<!-- #endif -->


<!-- #ifndef H5 -->
console.log('b');
<!-- #endif -->

console.log('c');
`;


const cssStr = `
/* #ifdef H5 */
console.log('a.1');
/* #endif */

/* #ifndef H5 */
console.log('b.1');
/* #endif */

console.log('c.1');
`;

const vueStr = `
// #ifdef H5
console.log('1');
// #endif

// #ifndef H5
console.log('2');
// #endif

console.log('3');



<!-- #ifdef H5 -->
console.log('a');
<!-- #endif -->


<!-- #ifndef H5 -->
console.log('b');
<!-- #endif -->

console.log('c');



/* #ifdef H5 */
console.log('a.1');
/* #endif */

/* #ifndef H5 */
console.log('b.1');
/* #endif */

console.log('c.1');
`;


describe('preprocessLoader.js', () => {
  it('preprocessLoader.1', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, jsStr)).toMatchSnapshot();
  });

  it('preprocessLoader.2', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, jsStr)).toMatchSnapshot();
  });

  it('preprocessLoader.3', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, jsStr)).toMatchSnapshot();
  });

  it('preprocessLoader.4', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, htmlStr)).toMatchSnapshot();
  });

  it('preprocessLoader.5', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, htmlStr)).toMatchSnapshot();
  });

  it('preprocessLoader.6', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, htmlStr)).toMatchSnapshot();
  });
  it('preprocessLoader.7', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, cssStr)).toMatchSnapshot();
  });
  it('preprocessLoader.8', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, cssStr)).toMatchSnapshot();
  });
  it('preprocessLoader.9', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, cssStr)).toMatchSnapshot();
  });
  it('preprocessLoader.10', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, vueStr)).toMatchSnapshot();
  });
  it('preprocessLoader.11', () => {
    expect(preprocessLoader.call({
      resourcePath: path.resolve(process.cwd(), './src', 'MOCK_PAGE.vue'),
    }, vueStr)).toMatchSnapshot();
  });
});

