import React from 'react';
import { Dropdown } from 'react-bootstrap';

// Change aspect ratio of images to match the post aspect ratio so that there are not cut offs on faces

export default class DropdownCustom extends React.Component {

  render() {

    const ellipsis = this.props.ellipsis;
    const options = this.props.options;

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <a
        href=""
        ref={ref}
        onClick={e => {
          e.preventDefault();
          onClick(e);
        }}
        className='text-dark'
      >
        {children}
        {ellipsis}
      </a>
    ));

    const saveRunId = event => {
      const runId = event.target.closest('.container').getAttribute('runid');
      const postId = event.target.closest('.container').getAttribute('postid');
      this.props.saveRunId(runId);
      this.props.savePostId(postId);
    };

    CustomToggle.displayName = 'Ellipsis dropdown';

    const items = options.map((option, index) => {
      const { href, text } = option;
      return (
        <Dropdown.Item key={index} href={href} onClick={saveRunId}>{text}</Dropdown.Item>
      );
    });

    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} />
        <Dropdown.Menu size="sm" title="">
          {items}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
