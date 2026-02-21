import React from 'react'
import { useSelector } from 'react-redux'
import { selectBlockById } from '../../ducks/selector/blockSelector'
import TextBlockEditor from './TextBlockEditor';

type Props = {
  blockId: string,
}

function BlockRenderer({ blockId }: Props) {

  const block = useSelector(selectBlockById(blockId));

  if (!block) return null;

  return (
  <>
    {block.type === "text" && (
      <TextBlockEditor block={block} />
    )}

    {block.type === "draw" && (
      <div>Drawing Block</div>
    )}
  </>
);
}

export default BlockRenderer