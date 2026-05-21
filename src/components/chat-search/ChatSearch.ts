import Block, { type BlockOwnProps } from "../../core/Block";
import "./chat-search.scss";

export type ChatSearchProps = BlockOwnProps;

export default class ChatSearch extends Block<ChatSearchProps> {
  static componentName = "ChatSearch";

  protected template = `
    <label class="chat-search">
      <input
        class="chat-search__input"
        type="search"
        name="search"
        placeholder="Поиск"
        autocomplete="off"
      />
    </label>
  `;
}
