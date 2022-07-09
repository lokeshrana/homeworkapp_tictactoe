import { expect } from 'chai';

import { updateContent, Renderer } from '@gqlapp/testing-client-react';

describe('Board UI works', () => {
  const renderer = new Renderer({});
  const app = renderer.mount();
  renderer.history.push('/Board');
  const content = updateContent(app.container);

  it('Board page renders on mount', () => {
    expect(content).to.not.be.empty;
  });

  it('Board page has title', async () => {
    expect(content.textContent).to.include('Hello, This is the Board module');
  });
});
