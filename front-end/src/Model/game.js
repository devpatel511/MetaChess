function Game() {
    return (
        <>
            <div className="direct-menu-items snipcss-gGM3M">
                <a href="/game/local" className="direct-menu-item-component direct-menu-item">
                    <div className="direct-menu-image-img direct-menu-image-friend direct-menu-item-img">
                    </div>
                    <div className="direct-menu-item-text">
                    <h2 className="direct-menu-item-title">
                        Local
                    </h2>
                    <div className="direct-menu-item-label">
                        Invite a friend to a game of chess
                    </div>
                    </div>
                </a>
                <a href="/login/:userId" className="direct-menu-item-component direct-menu-item">
                    <div className="direct-menu-image-img direct-menu-image-blitz direct-menu-item-img">
                    </div>
                    <div className="direct-menu-item-text">
                    <h2 className="direct-menu-item-title">
                        Online
                    </h2>
                    <div className="direct-menu-item-label">
                        Play vs a random person
                    </div>
                    </div>
                </a>
                <a href="/login/:userId" className="direct-menu-item-component direct-menu-item">
                    <div className="direct-menu-image-img direct-menu-image-computer direct-menu-item-img">
                    </div>
                    <div className="direct-menu-item-text">
                    <h2 className="direct-menu-item-title">
                        Computer
                    </h2>
                    <div className="direct-menu-item-label">
                        Challenge a ~1000 elo bot
                    </div>
                    </div>
                </a>
                <a href="/game/leaderboard" className="direct-menu-item-component direct-menu-item">
                    <div className="direct-menu-image-img direct-menu-image-tournaments direct-menu-item-img">
                    </div>
                    <div className="direct-menu-item-text">
                    <h2 className="direct-menu-item-title">
                        Leaderboard
                    </h2>
                    <div className="direct-menu-item-label">
                        See Online and Computer wins 
                    </div>
                    </div>
                </a>
            </div>
        </>
    )
}

export default Game