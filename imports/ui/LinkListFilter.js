import React from 'react';
import { Session } from "meteor/session";

export default () => {
    return (
        <label className='checkbox'>
          <input
            className='checkbox__box'
            type="checkbox"
            checked={Session.get("showHidden")}
            value={Session.get('showHidden')}
            onChange={(e) => Session.set("showHidden", e.target.checked)}
          />
          Show hidden links
        </label>
    );
}