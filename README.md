# securepath-api
SecurePath API wrapper for both client and server JavaScript written in TypeScript.

### Basic usage

```javascript
import { SecurePath } from "securepath-api";

const session = await SecurePath.login(
    "Username",
    "Password",
    {
        baseUrl: "rac.securepath.ae:<PORT>"
    }
);

const liveTrackerData = await session.Live.getTrackers()
```
