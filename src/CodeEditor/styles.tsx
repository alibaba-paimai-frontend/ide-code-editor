import styled from 'styled-components';

interface IEditorWrap {
  visible: boolean;
}

export const EditorWrap = styled.div`
  visibility: ${(props: IEditorWrap) => (props.visible ? 'visible' : 'hidden')};
  overflow: ${(props: IEditorWrap) => (props.visible ? 'visible' : 'hidden')};
  width: ${(props: IEditorWrap) => props.visible ? 'auto' : 0}px;
  height: ${(props: IEditorWrap) => props.visible ? 'auto' : 0}px;
`;
